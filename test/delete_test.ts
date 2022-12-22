jest.mock('../src/Configuration', () => ({
  ...jest.requireActual('../src/Configuration'),
  saveConfig: jest.fn(),
}));
jest.mock('../src/dialog');

import { AppConfiguration, ConfigurationNode, saveConfig } from '../src/Configuration';
import { deleteCobuConfiguration, deleteApplication, deleteFlag } from '../src/delete';
import { dialog } from '../src/dialog';
import { ExecutionContext } from '../src/executionTree';

describe('delete', () => {
  it('delete configuration', async () => {
    (dialog.yesNo as jest.Mock).mockResolvedValue(true);

    const ctx: ExecutionContext = {
      configuration: {
        apps: [
          {
            name: 'app',
            description: 'Test app',
          },
        ],
        debugLogging: true,
      },
      args: [],
    };
    await deleteCobuConfiguration(ctx);

    expect(saveConfig).toHaveBeenCalledWith({ apps: [], debugLogging: true });
  });

  it('delete application', async () => {
    (dialog.yesNo as jest.Mock).mockResolvedValue(true);

    const app1: AppConfiguration = {
      name: 'app',
      description: 'Test app',
    };
    const app2: AppConfiguration = {
      name: 'app2',
      description: 'Test app 2',
    };

    const ctx: ExecutionContext = {
      configuration: {
        apps: [app1, app2],
        debugLogging: true,
      },
      appConfiguration: app1,
      args: [],
    };
    await deleteApplication(ctx);

    expect(saveConfig).toHaveBeenCalledWith({
      apps: [
        {
          name: 'app2',
          description: 'Test app 2',
        },
      ],
      debugLogging: true,
    });
  });

  it('delete flag', async () => {
    (dialog.yesNo as jest.Mock).mockResolvedValue(true);

    const flag: ConfigurationNode = {
      name: 'flag1',
      description: 'Flag 1',
    };

    const appConfiguration: AppConfiguration = {
      name: 'app',
      description: 'Test app',
      flags: [
        flag,
        {
          name: 'flag2',
          description: 'Flag 2',
        },
      ],
    };

    const ctx: ExecutionContext = {
      configuration: {
        apps: [appConfiguration],
        debugLogging: true,
      },
      appConfiguration,
      flag,
      args: [],
    };
    await deleteFlag(ctx);

    expect(saveConfig).toHaveBeenCalledWith({
      apps: [{ description: 'Test app', flags: [], name: 'app' }],
      debugLogging: true,
    });
  });
});
