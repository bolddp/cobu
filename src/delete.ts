import { ExecutionContext } from './executionTree';
import { dialog } from './dialog';
import { saveConfig } from './Configuration';
import { loc } from './loc/Loc';

export const deleteCobuConfiguration = async (ctx: ExecutionContext) => {
  const shouldDelete = await dialog.yesNo(loc.confirmDeleteCobuConfig);
  if (shouldDelete) {
    ctx.configuration.apps = [];
    saveConfig(ctx.configuration);
  }
};

export const deleteApplication = async (ctx: ExecutionContext) => {
  const shouldDelete = await dialog.yesNo(
    loc.confirmDeleteApplication(ctx.appConfiguration?.name!)
  );
  if (shouldDelete) {
    ctx.configuration.apps.splice(ctx.configuration.apps.indexOf(ctx.appConfiguration!), 1);
    saveConfig(ctx.configuration);
  }
};

export const deleteFlag = async (ctx: ExecutionContext) => {
  const shouldDelete = await dialog.yesNo(
    loc.confirmDeleteFlag(ctx.appConfiguration?.name!, ctx.flag?.name!)
  );
  if (shouldDelete) {
    ctx.appConfiguration?.flags?.splice(ctx.appConfiguration?.flags?.indexOf(ctx.flag!));
    saveConfig(ctx.configuration);
  }
};
