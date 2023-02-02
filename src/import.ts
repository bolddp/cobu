import { AppConfiguration, saveConfig } from './Configuration';
import { dialog } from './dialog';
import { invalidImportInputError } from './error';
import { ExecutionContext } from './executionTree';
import { loc } from './loc/Loc';
import { log } from './log';

export const importApplication = async (ctx: ExecutionContext) => {
  const appName = ctx.args[0]!.source;
  const base64 = ctx.args[1]!.source;
  let importedApp: AppConfiguration;
  try {
    importedApp = JSON.parse(Buffer.from(base64, 'base64').toString());
    if (!importedApp.name) {
      throw new Error('Invalid data');
    }
  } catch (error: any) {
    throw invalidImportInputError();
  }
  // Confirm if we're overwriting an existing application
  const existingIndex = ctx.configuration.apps.findIndex((app) => app.name == appName);
  if (existingIndex >= 0) {
    const shouldImport = await dialog.yesNo(loc.confirmInputExistingApp(appName));
    if (!shouldImport) {
      return;
    }
  }
  importedApp.name = appName;
  if (existingIndex >= 0) {
    ctx.configuration.apps[existingIndex] = importedApp;
  } else {
    ctx.configuration.apps.push(importedApp);
  }
  saveConfig(ctx.configuration);
  log.info(loc.importedAppSuccessfully(appName));
};
