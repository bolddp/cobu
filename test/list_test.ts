jest.mock('../src/log', () => ({
  ...jest.requireActual('../src/Log'),
  log: {
    info: jest.fn(),
  },
}));

import { AppActionType, AppConfiguration, ConfigurationNode } from '../src/Configuration';
import { listApplication, listApplications, listFlag, printUsage } from '../src/list';
import { log } from '../src/log';

describe('docs', () => {
  it('should list applications', async () => {
    await listApplications({
      configuration: {
        apps: [
          {
            name: 'app1',
            flags: [
              {
                name: 'flag1',
                description: 'Description of flag1',
              },
              {
                name: 'flag2',
                description: 'Description of flag2',
              },
            ],
          },
        ],
        debugLogging: false,
      },
      args: [],
    });

    expect((log.info as jest.Mock).mock.calls).toEqual([
      ['Configured applications and flags'],
      ['  app1                              '],
      ['    flag1                           Description of flag1'],
      ['    flag2                           Description of flag2'],
    ]);
  });

  it('should list application', async () => {
    const appConfiguration: AppConfiguration = {
      name: 'app1',
      flags: [{ name: 'flag1', description: 'Description of flag1' }],
      actions: [
        {
          type: AppActionType.OpenApp,
          program: 'program',
          args: ['${param1}', 'sv'],
          arg: '> program ${param1} sv',
        },
        {
          type: AppActionType.OpenUrl,
          url: 'https://www.example.com',
          arg: 'https://www.example.com',
        },
      ],
      instructions: [
        {
          type: AppActionType.SetVariable,
          name: 'query',
          value: 'value',
          arg: '$query=value',
        },
        {
          type: AppActionType.UseArgumentVariable,
          name: 'query',
          defaultValue: 'defaultValue',
          argIndex: 0,
          arg: '${query:defaultValue}',
        },
      ],
    };
    await listApplication({
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      args: [],
    });

    expect((log.info as jest.Mock).mock.calls).toEqual([
      ['Configuration of application "app1"'],
      ['  == Actions =='],
      ['    - open app "program" with arguments "${param1}" "sv"'],
      ['    - open URL https://www.example.com'],
      ['    - set variable $query = "value"'],
      ['    - use argument variable at index 0'],
      ['  == Flags =='],
      ['    - flag1'],
    ]);
  });

  it('should list flag', async () => {
    const flag: ConfigurationNode = {
      name: 'flag1',
      description: 'Description of flag1',
      actions: [
        {
          type: AppActionType.OpenApp,
          program: 'program',
          args: ['${param1}', 'sv'],
          arg: '> program ${param1} sv',
        },
        {
          type: AppActionType.OpenUrl,
          url: 'https://www.example.com',
          arg: 'https://www.example.com',
        },
      ],
      instructions: [
        {
          type: AppActionType.SetVariable,
          name: 'query',
          value: 'value',
          arg: '$query=value',
        },
        {
          type: AppActionType.UseArgumentVariable,
          name: 'query',
          defaultValue: 'defaultValue',
          argIndex: 0,
          arg: '${query:defaultValue}',
        },
      ],
    };

    const appConfiguration: AppConfiguration = {
      name: 'app1',
      flags: [flag],
    };
    await listFlag({
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      flag,
      args: [],
    });

    expect((log.info as jest.Mock).mock.calls).toEqual([
      ['Configuration of flag "flag1" in application "app1"'],
      ['  == Actions =='],
      ['    - open app "program" with arguments "${param1}" "sv"'],
      ['    - open URL https://www.example.com'],
      ['    - set variable $query = "value"'],
      ['    - use argument variable at index 0'],
    ]);
  });

  it('should list no applications', async () => {
    await listApplications({
      configuration: {
        apps: [],
        debugLogging: false,
      },
      args: [],
    });

    expect((log.info as jest.Mock).mock.calls).toEqual([
      ['No applications have been configured yet'],
    ]);
  });

  it('would print usage', () => {
    printUsage();

    expect(log.info).toHaveBeenCalled();
  });
});
