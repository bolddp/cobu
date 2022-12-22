jest.mock('../src/log', () => ({
  ...jest.requireActual('../src/Log'),
  log: {
    info: jest.fn(),
  },
}));

import { listApplications, printUsage } from '../src/docs';
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
      ['\nConfigured applications and flags:'],
      ['  app1                              '],
      ['    flag1                           Description of flag1'],
      ['    flag2                           Description of flag2'],
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
