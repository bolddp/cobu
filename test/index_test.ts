const loadOrCreateConfigMock = jest.fn();
const saveConfigMock = jest.fn();

jest.mock('../src/Configuration', () => ({
  ...jest.requireActual('../src/Configuration'),
  loadOrCreateConfig: loadOrCreateConfigMock,
  saveConfig: saveConfigMock,
}));
jest.mock('../src/log');

import { Configuration } from '../src/Configuration';
import { main } from '../src/index';
import { log } from '../src/log';

describe('index', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('will config and save flag', async () => {
    loadOrCreateConfigMock.mockReturnValue({
      apps: [],
    });

    await main(['config', 'app', 'flag', 'https://www.example.com']);

    expect(saveConfigMock).toHaveBeenCalledWith({
      apps: [
        {
          flags: [
            {
              actions: [
                { arg: 'https://www.example.com', type: 'OpenUrl', url: 'https://www.example.com' },
              ],
              description: undefined,
              name: 'flag',
            },
          ],
          name: 'app',
        },
      ],
    });
  });

  it('will handle error', async () => {
    const cfg: Configuration = {
      debugLogging: false,
      apps: [
        {
          name: 'test',
        },
      ],
    };
    loadOrCreateConfigMock.mockReturnValue(cfg);

    await main(['notExisting']);

    expect(log.error).toHaveBeenCalledWith('Application "notExisting" not found');
    expect((log.info as any).mock.calls).toEqual([['Available apps are:'], ['  test']]);
  });
});
