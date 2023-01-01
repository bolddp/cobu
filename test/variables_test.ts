import { AppActionType, AppConfiguration, Configuration } from '../src/Configuration';
import { CobuError } from '../src/error';
import { ExecutionContext } from '../src/executionTree';
import { extractVariables, resolveVariables } from '../src/variables';

describe('variables', () => {
  it('will extract variables', async () => {
    const variables = extractVariables('https://www.${domain}.se/q=${query:Whattahell?}');
    expect(variables).toEqual([
      {
        name: 'domain',
      },
      {
        name: 'query',
        defaultValue: 'Whattahell?',
      },
    ]);
  });

  it('will resolve variables', () => {
    const ctx: ExecutionContext = {
      configuration: {
        apps: [],
        debugLogging: false,
      },
      args: [],
    };
    const vars = resolveVariables(ctx, 'This is the domain: ${domain}', [
      {
        name: 'domain',
        value: 'https://www.dn.${topDomain}',
      },
      {
        name: 'topDomain',
        value: 'se',
      },
    ]);

    expect(vars).toEqual('This is the domain: https://www.dn.se');
  });

  it('will throw error on unresolved variable', () => {
    const appConfiguration: AppConfiguration = {
      name: 'app',
      flags: [
        {
          name: 'subFolderProvider',
          instructions: [
            {
              type: AppActionType.SetVariable,
              name: 'subFolder',
              value: 'Whatever!',
              arg: 'subFolder',
            },
          ],
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

    expect(() =>
      resolveVariables(ctx, 'https://www.${domain}/${subFolder}', [
        {
          name: 'domain',
          value: 'www.dn.${topDomain}',
        },
        {
          name: 'topDomain',
          value: 'se',
        },
      ])
    ).toThrow(
      'Variable "${subFolder}" could not be resolved, and no default value has been provided'
    );
  });

  it('will throw on circular references', () => {
    expect(() =>
      resolveVariables({} as any, 'https://www.${domain}.se', [
        {
          name: 'domain',
          value: '${var1}',
        },
        {
          name: 'var1',
          value: '${var2}',
        },
        {
          name: 'var2',
          value: '${domain}',
        },
      ])
    ).toThrow('Circular variable references detected: $domain -> $var1 -> $var2 -> $domain');
  });
});
