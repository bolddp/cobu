import { ExecutionContext } from './executionTree';
import { loc } from './loc/Loc';
import { log } from './log';

export const listApplications = async (ctx: ExecutionContext) => {
  const result: string[][] = [];
  for (const app of ctx.configuration.apps) {
    result.push([`  ${app.name}`, app.description ?? '']);
    for (const flag of app.flags ?? []) {
      result.push([`    ${flag.name}`, flag.description ?? '']);
    }
  }
  if (result.length > 0) {
    log.info(loc.listApplicationsHeader);
    result.forEach((r) => log.info(`${r[0].padEnd(35)} ${r[1]}`));
  } else {
    log.info(loc.noApplicationsAvailable);
  }
};

export const printUsage = () => {
  for (const str of loc.usageInfo) {
    log.info(str);
  }
};
