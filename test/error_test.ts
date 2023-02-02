import { ArgType } from '../src/classifyArgs';
import { AppActionType, AppConfiguration, ConfigurationNode } from '../src/Configuration';
import {
  invalidAppNameError,
  noActionFoundError,
  unexpectedArgumentError,
  unknownAppError,
  unknownFlagError,
  unknownOptionError,
  unresolvedOptionError,
  variableNotFoundError,
} from '../src/error';

describe('error', () => {
  it('will create unknownAppError', () => {
    const error = unknownAppError({
      configuration: {
        apps: [
          {
            name: 'app1',
          },
        ],
        debugLogging: false,
      },
      args: [
        {
          type: ArgType.Flag,
          source: 'source',
        },
      ],
    });

    expect(error.message).toEqual('Application "source" not found');
    expect(error.info).toEqual(['Available apps are:', '  app1']);
  });

  it('will create unknownFlagError', () => {
    const appConfiguration: AppConfiguration = {
      name: 'app1',
      flags: [
        {
          name: 'flag1',
        },
      ],
    };
    const error = unknownFlagError({
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      args: [
        {
          type: ArgType.Flag,
          source: 'invalidFlag',
        },
      ],
    });

    expect(error.message).toEqual('No configured flag "invalidFlag" in application "app1"');
    expect(error.info).toEqual(['Available flags are:', '  flag1']);
  });

  it('will create noActionFoundError', () => {
    const error = noActionFoundError();

    expect(error.message).toEqual('Could not find any action to perform');
  });

  it('will create variableNotFoundError', () => {
    const appConfiguration: AppConfiguration = {
      name: 'app1',
      flags: [
        {
          name: 'flag1',
          instructions: [
            {
              type: AppActionType.SetVariable,
              name: 'varName',
              arg: '${varName}',
              value: 'value',
            },
          ],
        },
      ],
    };
    const error = variableNotFoundError('${varName}', {
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      args: [],
    });

    expect(error.message).toEqual(
      'Variable "${varName}" could not be resolved, and no default value has been provided'
    );
    expect(error.info).toEqual(['The following flags provide this variable: ["flag1"]']);
  });

  it('will create unexpectedArgumentError', () => {
    const error = unexpectedArgumentError({
      type: ArgType.VarAssignment,
      name: 'var1',
      source: '${var1}',
    });

    expect(error.message).toEqual('Unexpected argument: ${var1}');
  });

  it('will create invalidAppNameError', () => {
    const error = invalidAppNameError('delete');
    expect(error.message).toEqual(
      '"delete" is not a valid application name, since there is a command by that name'
    );
  });

  it('will create unresolvedOptionError', () => {
    const error = unresolvedOptionError('option');
    expect(error.message).toEqual('No value provided for option "option"');
  });

  it('will create unknownOptionError', () => {
    const error = unknownOptionError('option');
    expect(error.message).toEqual('Unknown option "option"');
  });
});
