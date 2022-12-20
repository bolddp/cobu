import { columns, header } from '../docs';
import { Loc } from './Loc';

export const En: Loc = {
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
    `Variable ${variable} could not be resolved, and no default value has been provided`,
  noFlagProvidesVariable:
    'There is no flag in the currect configuration that can provide this variable, which indicates a misconfiguration of the application',
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
  listApplicationsHeader: '\nConfigured applications and flags:',
  noApplicationsAvailable: 'No applications have been configured yet',
  invalidAppName: (appName) =>
    `"${appName}" is not a valid application name, since there is a command by that name`,
  unresolvedOption: (option) => `No value provided for option "${option}"`,
  unknownOption: (option) => `Unknown option "${option}"`,
  invalidDebugOption: 'Invalid debug value, please set "on" or "off"',
  confirmEditApplication: 'Are you sure you want to edit the cobu configuration manually? (y/n)',
  replacingActions: (count, appName, flagName) =>
    `Replacing ${count} actions in ${flagName ? `flag ${flagName}` : `application ${appName}`}`,
  addingActions: (count, appName, flagName) =>
    `Adding ${count} actions to ${flagName ? `flag ${flagName}` : `application ${appName}`}`,
  replacingInstructions: (count, appName, flagName) =>
    `Replacing ${count} instructions in ${
      flagName ? `flag ${flagName}` : `application ${appName}`
    }`,
  addingInstructions: (count, appName, flagName) =>
    `Adding ${count} instructions to ${flagName ? `flag ${flagName}` : `application ${appName}`}`,

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
        ['cobu list', 'List all applications and their flags'],
        [
          'cobu config application [flag] actions',
          'Configure an application or application flag with one or more actions',
        ],
        ['cobu delete application [flag]', 'Delete an application or an application flag'],
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
