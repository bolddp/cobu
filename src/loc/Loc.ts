import { AppInstruction } from '../Configuration';
import { ExecutionContext } from '../executionTree';
import { En } from './En';

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

  usageInfo: string[];
}

export let loc: Loc = En;
