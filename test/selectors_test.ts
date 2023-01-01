import { selectApplication, selectCommand, selectFlag } from '../src/selectors';
import { commands } from '../src/commands';
import { ExecutionContext } from '../src/executionTree';
import { ArgType } from '../src/classifyArgs';
import { AppConfiguration } from '../src/Configuration';

describe('selectors', () => {
  it('will select command', () => {
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'config',
          source: 'config',
        },
      ],
      configuration: { apps: [], debugLogging: false },
    };
    expect(selectCommand(ctx, commands.config)).toEqual(true);
  });

  it('will not select command', () => {
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'whatever',
          source: 'whatever',
        },
      ],
      configuration: { apps: [], debugLogging: false },
    };
    expect(selectCommand(ctx, commands.config)).toEqual(false);
  });

  it('will throw when application matches command', () => {
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'config',
          source: 'config',
        },
      ],
      configuration: { apps: [], debugLogging: false },
    };

    expect(() => selectApplication(ctx, 'throwOnMissing')).toThrow(
      '"config" is not a valid application name, since there is a command by that name'
    );
  });

  it('will throw when application not entered', () => {
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.VarAssignment,
          name: 'var1',
          source: '$var1=value',
          value: 'value',
        },
      ],
      configuration: { apps: [], debugLogging: false },
    };

    expect(() => selectApplication(ctx, 'throwOnMissing')).toThrow(
      'You need to provide an application'
    );
  });

  it('will throw when application not found', () => {
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'unknownApp',
          source: 'unknownApp',
        },
      ],
      configuration: { apps: [], debugLogging: false },
    };

    expect(() => selectApplication(ctx, 'throwOnMissing')).toThrow(
      'Application "unknownApp" not found'
    );
  });

  it('will accept existing application', () => {
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'app1',
          source: 'app1',
        },
      ],
      configuration: {
        apps: [{ name: 'app1' }],
        debugLogging: false,
      },
    };

    expect(selectApplication(ctx, 'throwOnMissing')).toEqual(true);
  });

  it('will create application that does not exist', () => {
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'app1',
          source: 'app1',
        },
      ],
      configuration: {
        apps: [],
        debugLogging: false,
      },
    };

    expect(selectApplication(ctx, 'create')).toEqual(true);
    expect(ctx.appConfiguration?.name).toEqual('app1');
  });

  it('will select flag', () => {
    const appConfiguration: AppConfiguration = {
      name: 'app1',
      flags: [{ name: 'flag1' }],
    };
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'flag1',
          source: 'flag1',
        },
      ],
      appConfiguration,
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
    };

    expect(selectFlag(ctx, 'throwOnMissing')).toEqual(true);
    expect(ctx.flag?.name).toEqual('flag1');
  });

  it('will not select flag', () => {
    const appConfiguration: AppConfiguration = {
      name: 'app1',
      flags: [{ name: 'flag1' }],
    };
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'unknownFlag',
          source: 'unknownFlag',
        },
      ],
      appConfiguration,
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
    };

    expect(() => selectFlag(ctx, 'throwOnMissing')).toThrow(
      'No configured flag "unknownFlag" in application "app1"'
    );
  });

  it('will not select flag when input is other', () => {
    const appConfiguration: AppConfiguration = {
      name: 'app1',
      flags: [{ name: 'flag1' }],
    };
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.VarAssignment,
          name: 'var1',
          source: '$var1=value',
          value: 'value',
        },
      ],
      appConfiguration,
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
    };

    expect(selectFlag(ctx, 'throwOnMissing')).toEqual(false);
  });

  it('will create flag', () => {
    const appConfiguration: AppConfiguration = {
      name: 'app1',
      flags: [],
    };
    const ctx: ExecutionContext = {
      args: [
        {
          type: ArgType.Flag,
          name: 'flag1',
          source: 'flag1',
        },
      ],
      appConfiguration,
      configuration: {
        apps: [appConfiguration],
        debugLogging: false,
      },
    };

    expect(selectFlag(ctx, 'create')).toEqual(true);
    expect(ctx.flag?.name).toEqual('flag1');
  });
});
