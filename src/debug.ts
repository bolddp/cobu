import { ArgType } from './classifyArgs';
import { saveConfig } from './Configuration';
import { invalidDebugOptionError } from './error';
import { ExecutionContext } from './executionTree';
import { loc } from './loc/Loc';
import { log, setDebugLogging } from './log';

export const setDebug = async (ctx: ExecutionContext) => {
  const argment = ctx.args[0];
  if (argment?.type == ArgType.Flag && (argment.name == 'on' || argment.name == 'off')) {
    const value = argment.name == 'on';
    log.info(loc.settingDebug(value));
    ctx.configuration.debugLogging = value;
    saveConfig(ctx.configuration);
    setDebugLogging(value);
  } else {
    throw invalidDebugOptionError();
  }
};
