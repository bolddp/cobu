import { isCommand } from './commands';
import { unknownOptionError, unresolvedOptionError } from './error';
import { log } from './log';
import { options } from './options';

export const urlRegex = /^http[s]{0,1}:\/\/.+$/;

const varAssignmentRegex = /^\$([a-zA-Z]+?)=(.*)$/;
const varStatementRegex = /^\$\{(.*?)(?::(.*?)){0,1}\}$/;
const appReferenceRegex = /^>[ ]{0,1}(.*?)(?: (.+)){0,1}$/;
const flagRegex = /^[a-zA-Z]{1}[a-zA-Z0-9_\-]+$/;
const optionRegex = /^\-\-(.*)$/;

export const classifyArgs = (args: string[]): Argument[] => {
  log.debug(`classifyArgs: ${JSON.stringify(args)}`);
  const result: Argument[] = [];
  let index = 0;
  while (index < args.length) {
    const arg = args[index];

    // Variable assignment: $name=value
    let match = varAssignmentRegex.exec(arg);
    if (match) {
      result.push({ type: ArgType.VarAssignment, source: arg, name: match[1], value: match[2] });
      index += 1;
      continue;
    }

    // Variable statement: ${name}
    match = varStatementRegex.exec(arg);
    if (match) {
      result.push({ type: ArgType.VarStatement, source: arg, name: match[1], value: match[2] });
      index += 1;
      continue;
    }

    // URL: http(s): //...
    match = urlRegex.exec(arg);
    if (match) {
      result.push({ type: ArgType.Url, source: arg, value: arg });
      index += 1;
      continue;
    }

    // App reference
    match = appReferenceRegex.exec(arg);
    if (match) {
      result.push({ type: ArgType.AppReference, source: arg, name: match[1], value: match[2] });
      index += 1;
      continue;
    }

    // Flag
    match = flagRegex.exec(arg);
    if (match) {
      result.push({ type: ArgType.Flag, source: arg, name: arg });
      index += 1;
      continue;
    }

    // Option (--description, --group etc.)
    match = optionRegex.exec(arg);
    if (match) {
      const option = match[1].toLowerCase();
      switch (option) {
        case options.add:
          result.push({ type: ArgType.Add, source: arg });
          index += 1;
          break;
        case options.description:
          if (!args[index + 1]) {
            throw unresolvedOptionError(arg);
          }
          result.push({ type: ArgType.Description, source: arg, value: args[index + 1] });
          index += 2;
          break;
        default:
          throw unknownOptionError(match[1]);
      }
      continue;
    }

    index += 1;
    result.push({ type: ArgType.Text, source: arg, value: arg });
  }

  log.debug(`did classifyArgs: ${JSON.stringify(result)}`);
  return result;
};

export interface Argument {
  type: ArgType;
  source: string;
  name?: string;
  value?: string;
}

export enum ArgType {
  Url = 'url',
  AppReference = 'AppReference',
  VarStatement = 'varStatement',
  VarAssignment = 'varAssignment',
  Flag = 'flag',
  Text = 'text',
  Add = 'add',
  Description = 'description',
}
