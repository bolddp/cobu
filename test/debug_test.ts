jest.mock('../src/Configuration', () => ({
  ...jest.requireActual('../src/Configuration'),
  saveConfig: jest.fn(),
}));

import { ArgType } from '../src/classifyArgs';
import { saveConfig } from '../src/Configuration';
import { setDebug } from '../src/debug';
import { ExecutionContext } from '../src/executionTree';

describe('debug', () => {
  it('should set debug', async () => {
    const ctx: ExecutionContext = {
      configuration: {
        apps: [],
        debugLogging: false,
      },
      args: [
        {
          type: ArgType.Flag,
          name: 'on',
          source: 'on',
        },
      ],
    };
    await setDebug(ctx);

    expect(saveConfig).toHaveBeenCalledWith({ apps: [], debugLogging: true });
  });

  it('should throw on invalid option', async () => {
    const ctx: ExecutionContext = {
      configuration: {
        apps: [],
        debugLogging: false,
      },
      args: [
        {
          type: ArgType.Flag,
          name: 'invalid',
          source: 'invalid',
        },
      ],
    };
    await expect(setDebug(ctx)).rejects.toThrowError(
      'Invalid debug value, please set "on" or "off"'
    );
  });
});
