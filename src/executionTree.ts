import { Argument } from './classifyArgs';
import { commands } from './commands';
import { ConfigurationNode, AppConfiguration, Configuration } from './Configuration';
import { configureApplication, configureFlag } from './configure';
import { setDebug } from './debug';
import { deleteApplication, deleteCobuConfiguration, deleteFlag } from './delete';
import { listApplications, printUsage } from './docs';
import { editApplication } from './edit';
import { runApplication } from './runApplication';
import { selectCommand, selectApplication, selectFlag } from './selectors';

export const executionTree: ExecutionTreeNode = {
  nodes: [
    {
      // configure
      selector: (ctx) => selectCommand(ctx, commands.config),
      nodes: [
        {
          // application
          selector: (ctx) => selectApplication(ctx, 'create'),
          nodes: [
            {
              // flag
              selector: (ctx) => selectFlag(ctx, 'create'),
              action: configureFlag,
            },
          ],
          orElse: configureApplication,
        },
      ],
    },
    {
      // delete
      selector: (ctx) => selectCommand(ctx, commands.delete),
      nodes: [
        {
          // application
          selector: (ctx) => selectApplication(ctx, 'throwOnMissing'),
          nodes: [
            {
              // flag
              selector: (ctx) => selectFlag(ctx, 'throwOnMissing'),
              action: deleteFlag,
            },
          ],
          orElse: deleteApplication,
        },
      ],
      orElse: deleteCobuConfiguration,
    },
    {
      // list
      selector: (ctx) => selectCommand(ctx, commands.list),
      action: listApplications,
    },
    {
      // edit
      selector: (ctx) => selectCommand(ctx, commands.edit),
      action: editApplication,
    },
    {
      // help
      selector: (ctx) => selectCommand(ctx, commands.help),
      action: async () => printUsage(),
    },
    {
      // debug
      selector: (ctx) => selectCommand(ctx, commands.debug),
      action: setDebug,
    },
    {
      // not a command, must assume an application is referred
      selector: (ctx) => selectApplication(ctx, 'throwOnMissing'),
      action: runApplication,
    },
  ],
  orElse: async () => printUsage(),
};

export const executeTree = async (ctx: ExecutionContext) => {
  await executeNode(executionTree, ctx);
};

const executeNode = async (node: ExecutionTreeNode, ctx: ExecutionContext) => {
  await node.action?.(ctx);
  if (ctx.args.length > 0) {
    for (const subNode of node.nodes ?? []) {
      const isSelected = subNode.selector?.(ctx);
      if (isSelected) {
        await executeNode(subNode, ctx);
        return;
      }
    }
  }
  // No matching subnodes were found, what should we do then?
  node.orElse?.(ctx);
};

export type NodeAction = (ctx: ExecutionContext) => Promise<void>;

export interface ExecutionContext {
  configuration: Configuration;
  appConfiguration?: AppConfiguration;
  flag?: ConfigurationNode;
  args: Argument[];
}

export interface ExecutionTreeNode {
  selector?: (ctx: ExecutionContext) => boolean;
  nodes?: ExecutionTreeNode[];
  action?: NodeAction;
  orElse?: NodeAction;
}
