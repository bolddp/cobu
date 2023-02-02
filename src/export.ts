import { ExecutionContext } from './executionTree';
import { loc } from './loc/Loc';
import { log } from './log';

export const exportApplication = async (ctx: ExecutionContext) => {
  log.info(loc.exportApplicationHeader(ctx.appConfiguration!.name));
  const base64Json = Buffer.from(JSON.stringify(ctx.appConfiguration!)).toString('base64');
  log.info(`\n> cobu import ${ctx.appConfiguration!.name} ${base64Json}`);
};
