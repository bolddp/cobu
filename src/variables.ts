import { urlRegex } from './classifyArgs';
import { VariableDeclaration } from './Configuration';
import { variableNotFoundError } from './error';
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
  str: string,
  variables: RunVariable[]
): string => {
  const variableRegex = /\$\{(.*?)(?::(.*?)){0,1}\}/g;

  return str.replace(variableRegex, (match, ...hits) => {
    let variable = variables.find((v) => v.name == hits[0]);
    if (!variable) {
      if (hits[1] == undefined) {
        throw variableNotFoundError(match, ctx);
      }
    }
    let result = resolveVariables(ctx, variable?.value ?? hits[1], variables);
    // If the variable seems to be an URL, we encode it
    if (urlRegex.test(result)) {
      result = encodeURI(result);
    }
    return result;
  });
};
