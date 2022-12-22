import * as fs from 'fs';
import * as path from 'path';
import { loc } from './loc/Loc';
import { log } from './log';

export interface Configuration {
  apps: AppConfiguration[];
  debugLogging: boolean;
}

export interface AppConfiguration extends ConfigurationNode {
  flags?: ConfigurationNode[];
}

export interface ConfigurationNode {
  name: string;
  description?: string;
  actions?: AppAction[];
  instructions?: AppInstruction[];
}

export enum AppActionType {
  OpenUrl = 'OpenUrl',
  OpenApp = 'OpenApp',
  SetVariable = 'SetVariable',
  UseArgumentVariable = 'UseArgumentVariable',
}

export const actionTypes: AppActionType[] = [AppActionType.OpenApp, AppActionType.OpenUrl];
export const instructionTypes: AppActionType[] = [AppActionType.SetVariable];

export type AppAction = OpenUrlAction | OpenAppAction;
export type AppInstruction = SetVariable | UseArgumentVariable;

export interface AppActionInterface {
  type: AppActionType;
  /**
   * The input argument that this action was built from
   */
  arg: string;
}

export interface OpenUrlAction extends AppActionInterface {
  type: AppActionType.OpenUrl;
  url: string;
}

export interface OpenAppAction extends AppActionInterface {
  type: AppActionType.OpenApp;
  program: string;
  args: string[];
}

export interface SetVariable extends AppActionInterface {
  type: AppActionType.SetVariable;
  name: string;
  value: string;
}

export interface UseArgumentVariable extends AppActionInterface {
  type: AppActionType.UseArgumentVariable;
  name: string;
  argIndex: number;
  defaultValue?: string;
}

export interface VariableDeclaration {
  name: string;
  argIndex?: number;
  defaultValue?: string;
}

export const loadOrCreateConfig = (): Configuration => {
  const configFilePath = getConfigFilePath();
  if (fs.existsSync(configFilePath)) {
    try {
      log.debug(`Loading config from '${configFilePath}'`);
      return JSON.parse(fs.readFileSync(configFilePath).toString('utf-8'));
    } catch (error: any) {
      log.warn(loc.couldNotLoadConfigCreatingNew);
    }
  }
  return { apps: [], debugLogging: false };
};

export const saveConfig = (cfg: Configuration) => {
  const configFileFolder = getConfigFileFolder();
  if (!fs.existsSync(configFileFolder)) {
    fs.mkdirSync(configFileFolder, { recursive: true });
  }
  const configFilePath = getConfigFilePath();
  log.debug(`Saving config to '${configFilePath}'`);
  fs.writeFileSync(configFilePath, JSON.stringify(cfg, undefined, 2));
};

export const getConfigFilePath = () => {
  return path.join(getConfigFileFolder(), 'cobu_config.json');
};

export const getFlagsThatProvideVariable = (
  varName: string,
  appConfig: AppConfiguration
): ConfigurationNode[] => {
  return (appConfig.flags ?? []).filter((f) =>
    (f.instructions ?? []).some((i) => `$\{${i.name}\}` == varName)
  );
};

const getConfigFileFolder = () => {
  const basePath =
    process.env.APPDATA ||
    (process.platform == 'darwin'
      ? process.env.HOME + '/Library/Preferences'
      : process.env.HOME + '/.local/share');
  return path.join(basePath, 'cobu');
};
