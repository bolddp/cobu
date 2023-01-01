import columnify from 'columnify';
import { AppInstruction } from '../Configuration';
import { ExecutionContext } from '../executionTree';

export interface Loc {
  locale: string;
  unknownApp: (appName: string) => string;
  availableApps: (apps: string[]) => string[];
  unknownFlag: (appName: string, flagName: string) => string;
  availableFlags: (flags: string[]) => string[];
  cannotFindCommandLineInput: (ctx: ExecutionContext, instruction: AppInstruction) => string;
  noActionFound: string;
  variableNotFound: (variable: string) => string;
  noFlagProvidesVariable: string;
  flagsThatProvideVariable: (flags: string[]) => string[];
  confirmDeleteCobuConfig: string;
  confirmDeleteApplication: (appName: string) => string;
  confirmDeleteFlag: (appName: string, flagName: string) => string;
  couldNotLoadConfigCreatingNew: string;
  unexpectedArgument: (arg: string) => string;
  listApplicationsHeader: string;
  listApplicationHeader: (appName: string) => string;
  listFlagHeader: (appName: string, flagName: string) => string;
  noApplicationsAvailable: string;
  invalidAppName: (appName: string) => string;
  unresolvedOption: (option: string) => string;
  unknownOption: (option: string) => string;
  invalidDebugOption: string;
  confirmEditApplication: string;
  replacingActions: (count: number, appName: string, flagName?: string) => string;
  addingActions: (count: number, appName: string, flagName?: string) => string;
  replacingInstructions: (count: number, appName: string, flagName?: string) => string;
  addingInstructions: (count: number, appName: string, flagName?: string) => string;
  openingAppWithoutArguments: (appName: string) => string;
  openingApp: (appName: string, args: string[]) => string;
  openingUrl: (url: string) => string;
  settingDebug: (value: boolean) => string;
  actions: string;
  flags: string;
  circularVariableRef: (path: string) => string;

  usageInfo: string[];
}

const header = (text: string): string => `\n${text}\n` + '='.repeat(100);

const columns = (data: string[][], minWidth: number): string => {
  const mapped = data.map((arr) => ({ col0: arr[0], col1: arr[1] }));
  return columnify(mapped, {
    showHeaders: false,
    config: {
      col0: { minWidth },
      col1: { maxWidth: 100 - minWidth },
    },
  });
};

const En: Loc = {
  locale: 'en',
  unknownApp: (appName) => `Application "${appName}" not found`,
  availableApps: (apps: string[]) => [`Available apps are:`, ...apps],
  unknownFlag: (appName, flagName) =>
    `No configured flag "${flagName}" in application "${appName}"`,
  availableFlags: (flags: string[]) => [`Available flags are:`, ...flags],
  cannotFindCommandLineInput: (ctx, instruction) => {
    return `Cannot find command line input expected for variable $${instruction.name}, you need to add at least one additional argument`;
  },
  noActionFound: 'Could not find any action to perform',
  variableNotFound: (variable) =>
    `Variable "${variable}" could not be resolved, and no default value has been provided`,
  noFlagProvidesVariable:
    'There is no flag in the current configuration that can provide this variable, which indicates a misconfiguration of the application',
  flagsThatProvideVariable: (flags) => [
    `The following flags provide this variable: ${JSON.stringify(flags)}`,
  ],
  confirmDeleteCobuConfig: 'Are you sure you want to delete your entire cobu configuration? (y/n)',
  confirmDeleteApplication: (appName) =>
    `Are you sure you want to delete the configuration for application "${appName}"? (y/n)`,
  confirmDeleteFlag: (appName, flagName) =>
    `Are you sure you want to delete flag "${flagName}" in application "${appName}"? (y/n)`,
  couldNotLoadConfigCreatingNew: 'Could not load config file, creating empty one',
  unexpectedArgument: (arg) => `Unexpected argument: ${arg}`,
  listApplicationsHeader: 'Configured applications and flags',
  listApplicationHeader: (appName) => `Configuration of application "${appName}"`,
  listFlagHeader: (appName, flagName) =>
    `Configuration of flag "${flagName}" in application "${appName}"`,
  noApplicationsAvailable: 'No applications have been configured yet',
  invalidAppName: (appName) =>
    `"${appName}" is not a valid application name, since there is a command by that name`,
  unresolvedOption: (option) => `No value provided for option "${option}"`,
  unknownOption: (option) => `Unknown option "${option}"`,
  invalidDebugOption: 'Invalid debug value, please set "on" or "off"',
  confirmEditApplication: 'Are you sure you want to edit the cobu configuration manually? (y/n)',
  replacingActions: (count, appName, flagName) =>
    `Replacing ${count} actions in ${flagName ? `flag "${flagName}"` : `application "${appName}"`}`,
  addingActions: (count, appName, flagName) =>
    `Adding ${count} actions to ${flagName ? `flag "${flagName}"` : `application "${appName}"`}`,
  replacingInstructions: (count, appName, flagName) =>
    `Replacing ${count} instructions in ${
      flagName ? `flag "${flagName}"` : `application "${appName}"`
    }`,
  addingInstructions: (count, appName, flagName) =>
    `Adding ${count} instructions to ${
      flagName ? `flag "${flagName}"` : `application "${appName}"`
    }`,
  openingAppWithoutArguments: (appName) => `Opening app "${appName}" without arguments`,
  openingApp: (appName, args) => `Opening app '${appName}' with arguments ${JSON.stringify(args)}`,
  openingUrl: (url) => `Opening URL "${url}"`,
  settingDebug: (value) => `Setting debug logging: ${value}`,
  flags: '== Flags ==',
  actions: '== Actions ==',
  circularVariableRef: (path) => `Circular variable references detected: ${path}`,

  usageInfo: [
    '*** COBU command builder - customizable Command Line Interface! ***',
    '\nUsage',
    '  cobu [command] application [flag] [actions] [instructions] [options]',
    'Options',
    columns(
      [
        [
          '--add',
          'Including this will add actions and instructions to the application or flag instead of replacing them',
        ],
        [
          '--description',
          'Attach a desccription to the application or flag that is being configured',
        ],
      ],
      45
    ),
    header('Examples'),
    columns(
      [
        [
          'cobu config application [flag] actions',
          'Configure an application or application flag with one or more actions',
        ],
        ['cobu delete application [flag]', 'Delete an application or an application flag'],
        [
          'cobu list [application] [flag]',
          'Lists info about an application or an application flag',
        ],
        ['cobu edit', 'Opens the cobu configuration in your default text editor'],
        ['cobu debug "on"/"off"', 'Turn debug logging on or off. Off by default'],
      ],
      45
    ),
    header('Actions'),
    columns(
      [
        ['https://www.example.com/${page}', 'Open URL in browser (supports variables)'],
        ['"> app ${arguments}"', 'Open app that is available in the path (supports variables)'],
        ['$variable="value"', 'Assign a value to a variable'],
        ['${argumentVariable}', 'Assign a variable from the command line'],
      ],
      45
    ),
    '\nUsage samples and other info: https://github.com/bolddp/cobu#readme',
  ],
};

export let loc: Loc = En;
