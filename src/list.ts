import { AppAction, AppActionType, AppInstruction, ConfigurationNode } from './Configuration';
import { ExecutionContext } from './executionTree';
import { loc } from './loc/Loc';
import { log } from './log';

export const listApplications = async (ctx: ExecutionContext) => {
  const result: string[][] = [];
  for (const app of ctx.configuration.apps) {
    result.push([ind(2, app.name), app.description ?? '']);
    for (const flag of app.flags ?? []) {
      result.push([ind(4, flag.name), flag.description ?? '']);
    }
  }
  if (result.length > 0) {
    log.info(loc.listApplicationsHeader);
    result.forEach((r) => log.info(`${r[0].padEnd(35)} ${r[1]}`));
  } else {
    log.info(loc.noApplicationsAvailable);
  }
};

export const listApplication = async (ctx: ExecutionContext) => {
  log.info(loc.listApplicationHeader(ctx.appConfiguration!.name));
  const actions = listActions(4, ctx.appConfiguration!);
  if (actions.length > 0) {
    log.info(ind(2, loc.actions));
    actions.forEach((str) => log.info(str));
  }
  if ((ctx.appConfiguration!.flags ?? []).length > 0) {
    log.info(ind(2, loc.flags));
    ctx.appConfiguration!.flags?.forEach((f) => log.info(ind(4, `- ${f.name}`)));
  }
};

export const listFlag = async (ctx: ExecutionContext) => {
  log.info(loc.listFlagHeader(ctx.appConfiguration!.name, ctx.flag!.name));
  const actions = listActions(4, ctx.flag!);
  if (actions.length > 0) {
    log.info(ind(2, loc.actions));
    actions.forEach((str) => log.info(str));
  }
};

const ind = (indent: number, str: string) => {
  return `${' '.repeat(indent)}${str}`;
};

const listActions = (indent: number, flag: ConfigurationNode): string[] => {
  const strs = (flag.actions ?? [])
    .map((a) => listAction(a))
    .concat((flag.instructions ?? []).map((a) => listAction(a)));
  return strs.map((s) => ind(indent, `- ${s}`));
};

const listAction = (action: AppAction | AppInstruction): string => {
  switch (action.type) {
    case AppActionType.OpenApp:
      return `open app "${action.program}" ${
        (action.args ?? []).length > 0
          ? `with arguments ${action.args.map((a) => `"${a}"`).join(' ')}`
          : 'with no arguments'
      }`;
    case AppActionType.OpenUrl:
      return `open URL ${action.url}`;
    case AppActionType.SetVariable:
      return `set variable $${action.name} = "${action.value}"`;
    case AppActionType.UseArgumentVariable:
      return `use argument variable at index ${action.argIndex}`;
  }
};

export const printUsage = () => {
  for (const str of loc.usageInfo) {
    log.info(str);
  }
};
