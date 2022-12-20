import { ArgType } from './classifyArgs';
import { isCommand } from './commands';
import { AppConfiguration } from './Configuration';
import { invalidAppNameError, unknownAppError, unknownFlagError } from './error';
import { ExecutionContext } from './executionTree';
import { log } from './log';

export const selectCommand = (ctx: ExecutionContext, commands: string[]): boolean => {
  const result = commands.includes((ctx.args[0]?.source ?? '').toLowerCase());
  if (result) {
    log.debug(`select command: ${ctx.args[0].source}`);
    ctx.args = ctx.args.slice(1);
  }
  return result;
};

export const selectApplication = (
  ctx: ExecutionContext,
  strategy: 'throwOnMissing' | 'create'
): boolean => {
  const argment = ctx.args[0];
  if (argment.type != ArgType.Flag) {
    return false;
  }
  if (isCommand(argment.name!)) {
    throw invalidAppNameError(argment.name!);
  }
  const arg = argment.name!;
  const resultIndex = ctx.configuration.apps.findIndex((a) => a.name == arg);
  if (resultIndex >= 0) {
    log.debug(`select application: ${arg}`);
    ctx.appConfiguration = ctx.configuration.apps[resultIndex];
  } else {
    if (strategy == 'create') {
      log.debug(`create application: ${arg}`);
      const application: AppConfiguration = { name: arg };
      ctx.configuration.apps.push(application);
      ctx.appConfiguration = application;
    } else if (strategy == 'throwOnMissing') {
      throw unknownAppError(ctx);
    }
  }
  ctx.args = ctx.args.slice(1);
  return true;
};

export const selectFlag = (
  ctx: ExecutionContext,
  strategy: 'throwOnMissing' | 'create'
): boolean => {
  const argment = ctx.args[0];
  if (argment.type != ArgType.Flag) {
    return false;
  }
  const arg = argment.name!;
  const resultIndex = (ctx.appConfiguration!.flags ?? []).findIndex((a) => a.name == arg);
  if (resultIndex >= 0) {
    log.debug(`select flag: ${arg}`);
    ctx.flag = ctx.appConfiguration!.flags![resultIndex];
  } else {
    if (strategy == 'create') {
      log.debug(`create flag: ${arg}`);
      ctx.flag = { name: arg };
      ctx.appConfiguration!.flags = (ctx.appConfiguration!.flags ?? []).concat([ctx.flag]);
    } else if (strategy == 'throwOnMissing') {
      throw unknownFlagError(ctx);
    }
  }
  ctx.args = ctx.args.slice(1);
  return true;
};
