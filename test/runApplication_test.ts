import open from 'open';
import { ArgType } from '../src/classifyArgs';
import { AppActionType, AppConfiguration, ConfigurationNode } from '../src/Configuration';
import { ExecutionContext } from '../src/executionTree';
import { runApplication } from '../src/runApplication';

jest.mock('open');

describe('runApplication', () => {
  it('should open URL from flag', async () => {
    const flag: ConfigurationNode = {
      name: 'testFlag',
      actions: [
        {
          type: AppActionType.OpenUrl,
          url: 'https://www.example.com/${subFolder}/${subFolder2}',
          arg: 'https://www.example.com/${subFolder}/${subFolder2}',
        },
      ],
      instructions: [
        {
          type: AppActionType.SetVariable,
          name: 'subFolder2',
          value: 'folder2',
          arg: '$subFolder2=folder2',
        },
      ],
    };
    const appConfiguration: AppConfiguration = {
      name: 'app',
      flags: [flag],
      instructions: [
        {
          type: AppActionType.UseArgumentVariable,
          argIndex: 0,
          name: 'subFolder',
          arg: '${subFolder}',
        },
      ],
    };
    const ctx: ExecutionContext = {
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      args: [
        {
          type: ArgType.Flag,
          name: 'testFlag',
          source: 'testFlag',
        },
        {
          type: ArgType.Flag,
          name: 'subFolderValue',
          source: 'subFolderValue',
        },
      ],
    };
    await runApplication(ctx);

    expect(open).toHaveBeenCalledWith(encodeURI('https://www.example.com/subFolderValue/folder2'));
  });

  it('should open app', async () => {
    const appConfiguration: AppConfiguration = {
      name: 'app',
      flags: [],
      actions: [
        {
          type: AppActionType.OpenApp,
          program: 'program',
          arg: '',
          args: ['${arg1}', '${arg2}'],
        },
      ],
      instructions: [
        {
          type: AppActionType.UseArgumentVariable,
          argIndex: 0,
          name: 'arg1',
          arg: '${arg1}',
        },
        {
          type: AppActionType.SetVariable,
          name: 'arg2',
          arg: '${arg2}',
          value: 'arg2Value',
        },
      ],
    };
    const ctx: ExecutionContext = {
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      args: [
        {
          type: ArgType.Flag,
          source: 'arg1Value',
        },
      ],
    };
    await runApplication(ctx);

    expect(open.openApp).toHaveBeenCalledWith('program', { arguments: ['arg1Value', 'arg2Value'] });
  });

  it('should open app without arguments', async () => {
    const appConfiguration: AppConfiguration = {
      name: 'app',
      flags: [],
      actions: [
        {
          type: AppActionType.OpenApp,
          program: 'program',
          arg: '',
          args: [],
        },
      ],
    };
    const ctx: ExecutionContext = {
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
      appConfiguration,
      args: [],
    };
    await runApplication(ctx);

    expect(open.openApp).toHaveBeenCalledWith('program');
  });
});
