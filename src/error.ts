import { Argument } from './classifyArgs';
import { ConfigurationNode, getFlagsThatProvideVariable } from './Configuration';
import { ExecutionContext } from './executionTree';
import { loc } from './loc/Loc';

export class CobuError extends Error {
  info: string[];

  constructor(message: string, info?: string[]) {
    super(message);
    this.info = info ?? [];
  }
}

export const unknownAppError = (ctx: ExecutionContext): CobuError => {
  const error = loc.unknownApp(ctx.args[0].source);
  const info = loc.availableApps((ctx.configuration.apps ?? []).map((a) => `  ${a.name}`));
  return new CobuError(error, info);
};

export const unknownFlagError = (ctx: ExecutionContext): CobuError => {
  const error = loc.unknownFlag(ctx.appConfiguration!.name, ctx.args[0].source);
  const info = loc.availableFlags((ctx.appConfiguration?.flags ?? []).map((a) => `  ${a.name}`));
  return new CobuError(error, info);
};

export const noActionFoundError = (ctx: ExecutionContext): CobuError =>
  new CobuError(loc.noActionFound);

export const variableNotFoundError = (varName: string, ctx: ExecutionContext): CobuError => {
  const error = loc.variableNotFound(varName);
  // Try to find the flags that provide the missing variable
  const flags: ConfigurationNode[] = getFlagsThatProvideVariable(varName, ctx.appConfiguration!);
  if (flags.length == 0) {
    return new CobuError(error, [loc.noFlagProvidesVariable]);
  } else {
    return new CobuError(error, loc.flagsThatProvideVariable(flags.map((f) => f.name)));
  }
};

export const unexpectedArgumentError = (arg: Argument): CobuError =>
  new CobuError(loc.unexpectedArgument(arg.source));

export const invalidAppNameError = (appName: string): CobuError =>
  new CobuError(loc.invalidAppName(appName));

export const unresolvedOptionError = (option: string): CobuError =>
  new CobuError(loc.unresolvedOption(option));

export const unknownOptionError = (option: string): CobuError =>
  new CobuError(loc.unknownOption(option));

export const invalidDebugOptionError = (): CobuError => {
  return new CobuError(loc.invalidDebugOption);
};

export const circularVariableRefError = (path: string[]): CobuError => {
  return new CobuError(loc.circularVariableRef(path.map((p) => `$${p}`).join(' -> ')));
};
