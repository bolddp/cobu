#!/usr/bin/env node
import { getDebugLogging, log, setDebugLogging } from './log';
import { loadOrCreateConfig } from './Configuration';
import { executeTree } from './executionTree';
import { CobuError } from './error';
import { classifyArgs } from './classifyArgs';

export const main = async (processArgs: string[]) => {
  if (processArgs.includes('--runInBand')) {
    return;
  }
  try {
    const configuration = loadOrCreateConfig();
    setDebugLogging(configuration.debugLogging);
    let args = classifyArgs(processArgs);
    await executeTree({
      configuration,
      args,
    });
  } catch (error: any) {
    if (error instanceof CobuError) {
      log.error(error.message);
      error.info.forEach((msg) => log.info(msg));
    } else {
      log.error(error.message);
    }
  }
  if (getDebugLogging()) {
    log.warn(
      `Debug logging is currently enabled and produces a lot of output. Turn it off with 'cobu debug off'`
    );
  }
};
main(process.argv.slice(2));
