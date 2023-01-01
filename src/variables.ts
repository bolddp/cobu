import { urlRegex } from './classifyArgs';
import { VariableDeclaration } from './Configuration';
import { circularVariableRefError, variableNotFoundError } from './error';
import { ExecutionContext } from './executionTree';

export interface RunVariable {
  name: string;
  value: string;
}

export const extractVariables = (str?: string): VariableDeclaration[] | undefined => {
  if (!str) {
    return;
  }
  const variableRegex = /\$\{(.*?)(?::(.*?)){0,1}\}/g;

  const results: VariableDeclaration[] = [];
  let m: any;
  while ((m = variableRegex.exec(str)) != null) {
    results.push({ name: m[1], defaultValue: m[2] });
  }
  return results.length == 0 ? undefined : results;
};

export const resolveVariables = (
  ctx: ExecutionContext,
  target: string,
  variables: RunVariable[],
  /**
   * Context that is used for recursive calls to detect circular references
   * and values that have already been resolved.
   */
  resolveCtx: {
    variableRefs: string[];
    resolved: RunVariable[];
  } = {
    variableRefs: [],
    resolved: [],
  }
): string => {
  const variableRegex = /\$\{(.*?)(?::(.*?)){0,1}\}/g;

  return target.replace(variableRegex, (match, ...hits) => {
    let variable = variables.find((v) => v.name == hits[0]);
    if (!variable) {
      if (hits[1] == undefined) {
        throw variableNotFoundError(match, ctx);
      }
      variable = { name: hits[0], value: hits[1] };
    }
    // Has this variable been resolved already?
    const resolvedVariable = resolveCtx.resolved.find((v) => v.name == variable!.name);
    if (resolvedVariable) {
      return resolvedVariable.value;
    }
    // Check for circular references
    if (resolveCtx.variableRefs.includes(variable.name)) {
      throw circularVariableRefError(resolveCtx.variableRefs.concat(variable.name));
    }
    resolveCtx.variableRefs.push(variable.name);
    let variableValue = resolveVariables(ctx, variable.value, variables, resolveCtx);
    // If the variable seems to be an URL, we encode it
    if (urlRegex.test(variableValue)) {
      variableValue = encodeURI(variableValue);
    }
    // Add the variable to the array of resolved variables
    resolveCtx.resolved.push({ name: variable.name, value: variableValue });
    return variableValue;
  });
};
