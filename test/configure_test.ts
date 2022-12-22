jest.mock('../src/Configuration', () => ({
  ...jest.requireActual('../src/Configuration'),
  saveConfig: jest.fn(),
}));
jest.mock('../src/log');

import { ArgType } from '../src/classifyArgs';
import {
  AppActionType,
  AppConfiguration,
  ConfigurationNode,
  saveConfig,
} from '../src/Configuration';
import { configureApplication, configureFlag, parseArgs } from '../src/configure';
import { ExecutionContext } from '../src/executionTree';
import { log } from '../src/log';

describe('configure', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('will configure new application', async () => {
    const appConfiguration: AppConfiguration = {
      name: 'test',
    };
    const ctx: ExecutionContext = {
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      args: [
        {
          type: ArgType.Url,
          source: 'https://www.example.com',
          value: 'https://www.example.com',
        },
        {
          type: ArgType.AppReference,
          name: 'testapp',
          source: '> testapp ${arg1} fixed',
          value: '${arg1} fixed',
        },
        {
          type: ArgType.VarAssignment,
          name: 'variable',
          source: '$variable=value',
          value: 'value',
        },
        {
          type: ArgType.VarStatement,
          name: 'query',
          source: '${query}',
        },
        {
          type: ArgType.Description,
          source: 'This is a test',
          value: 'This is a test',
        },
      ],
    };
    await configureApplication(ctx);

    expect(saveConfig).toHaveBeenCalledWith({
      apps: [
        {
          actions: [
            { arg: 'https://www.example.com', type: 'OpenUrl', url: 'https://www.example.com' },
            {
              arg: '> testapp ${arg1} fixed',
              args: ['${arg1}', 'fixed'],
              program: 'testapp',
              type: 'OpenApp',
            },
          ],
          description: 'This is a test',
          instructions: [
            { arg: '$variable=value', name: 'variable', type: 'SetVariable', value: 'value' },
            {
              arg: '${query}',
              argIndex: 3,
              name: 'query',
              type: 'UseArgumentVariable',
            },
          ],
          name: 'test',
        },
      ],
      debugLogging: false,
    });
  });

  it('will configure flag', async () => {
    const flag: ConfigurationNode = {
      name: 'flag',
      actions: [
        {
          type: AppActionType.OpenApp,
          program: 'testapp',
          arg: '> testapp',
          args: [],
        },
      ],
      instructions: [
        {
          type: AppActionType.SetVariable,
          name: 'variable',
          value: 'variableValue',
          arg: '$variable=variableValue',
        },
      ],
    };

    const appConfiguration: AppConfiguration = {
      name: 'app',
      flags: [flag],
    };

    const ctx: ExecutionContext = {
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      flag,
      args: [
        {
          type: ArgType.Url,
          source: 'https://www.example.com',
          value: 'https://www.example.com',
        },
        {
          type: ArgType.VarAssignment,
          name: 'variable',
          source: '$variable=value',
          value: 'value',
        },
        {
          type: ArgType.Description,
          source: 'This is a test',
          value: 'This is a test',
        },
      ],
    };
    await configureFlag(ctx);

    expect(saveConfig).toHaveBeenCalledWith({
      apps: [
        {
          flags: [
            {
              actions: [
                { arg: 'https://www.example.com', type: 'OpenUrl', url: 'https://www.example.com' },
              ],
              description: 'This is a test',
              instructions: [
                { arg: '$variable=value', name: 'variable', type: 'SetVariable', value: 'value' },
              ],
              name: 'flag',
            },
          ],
          name: 'app',
        },
      ],
      debugLogging: false,
    });

    expect((log.info as jest.Mock).mock.calls).toEqual([
      ['Replacing 1 actions in flag "flag"'],
      ['Replacing 1 instructions in flag "flag"'],
    ]);
  });

  it('will configure flag with add', async () => {
    const flag: ConfigurationNode = {
      name: 'flag',
      actions: [
        {
          type: AppActionType.OpenApp,
          program: 'testapp',
          arg: '> testapp',
          args: [],
        },
      ],
      instructions: [
        {
          type: AppActionType.SetVariable,
          name: 'variable',
          value: 'variableValue',
          arg: '$variable=variableValue',
        },
      ],
    };

    const appConfiguration: AppConfiguration = {
      name: 'app',
      flags: [flag],
    };

    const ctx: ExecutionContext = {
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      flag,
      args: [
        {
          type: ArgType.Url,
          source: 'https://www.example.com',
          value: 'https://www.example.com',
        },
        {
          type: ArgType.VarAssignment,
          name: 'variable',
          source: '$variable=value',
          value: 'value',
        },
        {
          type: ArgType.Add,
          source: '--add',
        },
      ],
    };
    await configureFlag(ctx);

    expect(saveConfig).toHaveBeenCalledWith({
      apps: [
        {
          flags: [
            {
              actions: [
                { arg: '> testapp', args: [], program: 'testapp', type: 'OpenApp' },
                { arg: 'https://www.example.com', type: 'OpenUrl', url: 'https://www.example.com' },
              ],
              description: undefined,
              instructions: [
                {
                  arg: '$variable=variableValue',
                  name: 'variable',
                  type: 'SetVariable',
                  value: 'variableValue',
                },
                { arg: '$variable=value', name: 'variable', type: 'SetVariable', value: 'value' },
              ],
              name: 'flag',
            },
          ],
          name: 'app',
        },
      ],
      debugLogging: false,
    });

    expect((log.info as jest.Mock).mock.calls).toEqual([
      ['Adding 1 actions to flag "flag"'],
      ['Adding 1 instructions to flag "flag"'],
    ]);
  });

  it('will parse arguments', () => {
    const args = parseArgs(
      'aws s3 "Some text and some quoted text: \\"Quote\\"" \'Single quotes\' ${query} "C:\\Users\\user" \'Then he said: \\\'No way!\\\'\''
    );
    expect(args).toEqual([
      'aws',
      's3',
      'Some text and some quoted text: "Quote"',
      'Single quotes',
      '${query}',
      'C:\\Users\\user',
      "Then he said: 'No way!'",
    ]);
  });
});
