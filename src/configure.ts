import { ArgType, Argument } from './classifyArgs';
import {
  AppAction,
  AppInstruction,
  OpenUrlAction,
  AppActionType,
  OpenAppAction,
  ConfigurationNode,
  saveConfig,
} from './Configuration';
import { unexpectedArgumentError } from './error';
import { ExecutionContext } from './executionTree';
import { loc } from './loc/Loc';
import { log } from './log';

export const configureApplication = async (ctx: ExecutionContext) => {
  await configureNode(ctx.appConfiguration!, ctx);
  saveConfig(ctx.configuration);
};

export const configureFlag = async (ctx: ExecutionContext) => {
  await configureNode(ctx.flag!, ctx);
  saveConfig(ctx.configuration);
};

const configureNode = async (node: ConfigurationNode, ctx: ExecutionContext) => {
  const { actions, instructions, description, add } = createActionsAndInstructions(ctx.args);
  if (actions.length > 0) {
    if (!add) {
      if ((node.actions ?? []).length > 0) {
        log.info(
          loc.replacingActions(node.actions!.length, ctx.appConfiguration!.name, ctx.flag?.name)
        );
      }
      node.actions = actions;
    } else {
      log.info(loc.addingActions(actions.length, ctx.appConfiguration!.name, ctx.flag?.name));
      node.actions = (node.actions ?? []).concat(actions);
    }
  }
  if (instructions.length > 0) {
    if (!add) {
      if ((node.instructions ?? []).length > 0) {
        log.info(
          loc.replacingInstructions(
            node.instructions!.length,
            ctx.appConfiguration!.name,
            ctx.flag!.name
          )
        );
      }
      node.instructions = instructions;
    } else {
      log.info(
        loc.addingInstructions(instructions.length, ctx.appConfiguration!.name, ctx.flag!.name)
      );
      node.instructions = (node.instructions ?? []).concat(instructions);
    }
  }
  node.description = description;
};

interface ActionsAndInstructions {
  actions: AppAction[];
  instructions: AppInstruction[];
  add: boolean;
  description?: string;
}

const createActionsAndInstructions = (args: Argument[]): ActionsAndInstructions => {
  const result: ActionsAndInstructions = { actions: [], instructions: [], add: false };
  args.forEach((argment, argIndex) => {
    switch (argment.type) {
      case ArgType.Url:
        result.actions.push(<OpenUrlAction>{
          type: AppActionType.OpenUrl,
          url: argment.value,
          arg: argment.source,
        });
        break;
      case ArgType.AppReference:
        result.actions.push(<OpenAppAction>{
          type: AppActionType.OpenApp,
          program: argment.name,
          args: parseArgs(argment.value),
          arg: argment.source,
        });
        break;
      case ArgType.VarAssignment:
        result.instructions.push({
          type: AppActionType.SetVariable,
          name: argment.name!,
          value: argment.value!,
          arg: argment.source,
        });
        break;
      case ArgType.VarStatement:
        result.instructions.push({
          type: AppActionType.UseArgumentVariable,
          name: argment.name!,
          argIndex,
          defaultValue: argment.value,
          arg: argment.source,
        });
        break;
      case ArgType.Description:
        result.description = argment.value;
        break;
      case ArgType.Add:
        result.add = true;
        break;
      default:
        throw unexpectedArgumentError(argment);
    }
  });
  return result;
};

export const parseArgs = (str?: string): string[] => {
  if (!str) {
    return [];
  }
  const result: string[] = [''];
  let state: 'scan' | 'space' | 'sq' | 'dq' = 'scan';
  let index = 0;
  let resultIndex = 0;
  while (index < str.length) {
    const char = str[index];
    switch (state) {
      case 'scan':
        if (char == ' ') {
          // Do nothing
        } else if (char == '"') {
          state = 'dq';
        } else if (char == "'") {
          state = 'sq';
        } else {
          state = 'space';
          result[resultIndex] += char;
        }
        break;
      case 'space':
        if (char == ' ') {
          resultIndex += 1;
          result[resultIndex] = '';
          state = 'scan';
        } else {
          result[resultIndex] += char;
        }
        break;
      case 'sq':
        if (char == "'") {
          resultIndex += 1;
          result[resultIndex] = '';
          state = 'scan';
        } else if (char == '\\') {
          if (str[index + 1] == "'") {
            index += 1;
            result[resultIndex] += "'";
          } else {
            result[resultIndex] += '\\';
          }
        } else {
          result[resultIndex] += char;
        }
        break;
      case 'dq':
        if (char == '"') {
          resultIndex += 1;
          result[resultIndex] = '';
          state = 'scan';
        } else if (char == '\\') {
          if (str[index + 1] == '"') {
            index += 1;
            result[resultIndex] += '"';
          } else {
            result[resultIndex] += '\\';
          }
        } else {
          result[resultIndex] += char;
        }
        break;
    }
    index += 1;
  }
  return result.filter((r) => r != '');
};
