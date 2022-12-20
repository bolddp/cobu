import open from 'open';
import { ArgType } from './classifyArgs';
import { AppAction, AppActionType } from './Configuration';
import { CobuError, noActionFoundError, unknownFlagError } from './error';
import { ExecutionContext } from './executionTree';
import { loc } from './loc/Loc';
import { log } from './log';
import { resolveVariables, RunVariable } from './variables';

export const runApplication = async (ctx: ExecutionContext) => {
  const appConfiguration = ctx.appConfiguration!;
  let actions = appConfiguration.actions;
  const instructions = appConfiguration.instructions ?? [];
  const variables: RunVariable[] = [];

  // Does the application have flags that we need to match against the command line arguments?
  if ((appConfiguration.flags ?? []).length > 0) {
    let index = 0;
    while (index < ctx.args.length) {
      const argment = ctx.args[index];
      if (argment.type == ArgType.Flag) {
        const node = appConfiguration.flags!.find((n) => n.name == argment.name!);
        if (node) {
          if (node.actions) {
            actions = node.actions;
          }
          instructions.push(...(node.instructions ?? []));
          ctx.args.splice(index, 1);
          index -= 1;
        } else {
          throw unknownFlagError(ctx);
        }
      }
      index += 1;
    }
  }

  for (const instruction of instructions) {
    if (instruction.type == AppActionType.SetVariable) {
      let variable = variables.find((v) => v.name == instruction.name);
      if (!variable) {
        variable = {
          name: instruction.name,
          value: instruction.value,
        };
        variables.push(variable);
      } else {
        variable.value = instruction.value;
      }
    } else if (instruction.type == AppActionType.UseArgumentVariable) {
      if (ctx.args.length <= instruction.argIndex) {
        throw new CobuError(loc.cannotFindCommandLineInput(ctx, instruction));
      }
      let variable = variables.find((v) => v.name == instruction.name);
      if (!variable) {
        variable = {
          name: instruction.name,
          value: ctx.args[instruction.argIndex].source,
        };
        variables.push(variable);
      } else {
        variable.value = ctx.args[instruction.argIndex].source;
      }
    }
  }

  if ((actions ?? []).length == 0) {
    throw noActionFoundError(ctx);
  }

  await executeActions(ctx, actions!, variables);
};

const executeActions = async (
  ctx: ExecutionContext,
  actions: AppAction[],
  variables: RunVariable[]
) => {
  for (const action of actions) {
    switch (action.type) {
      case AppActionType.OpenApp:
        if (!action.args) {
          log.info(`Opening app '${action.program}' without arguments`);
          await open.openApp(action.program);
        } else {
          const appArgs = [resolveVariables(ctx, action.args, variables)];
          log.info(`Opening app '${action.program}' with arguments [${appArgs}]`);
          await open.openApp(action.program, { arguments: appArgs });
        }
        break;
      case AppActionType.OpenUrl:
        const url = resolveVariables(ctx, action.url, variables);
        log.info(`Opening URL: ${url}`);
        await open(encodeURI(url));
    }
  }
};
