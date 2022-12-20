jest.mock('fs');

import * as fs from 'fs';

import {
  AppActionType,
  getFlagsThatProvideVariable,
  loadOrCreateConfig,
  saveConfig,
} from '../src/Configuration';

describe('Configuration', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load config', () => {
    process.env.APPDATA = 'C:\\Users\\user\\AppData\\Roaming';

    (fs.readFileSync as any).mockReturnValue(JSON.stringify({ apps: [] }));
    (fs.existsSync as any).mockReturnValue(true);

    const config = loadOrCreateConfig();
    expect(config).toEqual({ apps: [] });
    expect(fs.readFileSync).toHaveBeenCalledWith(
      'C:\\Users\\user\\AppData\\Roaming\\cobu\\cobu_config.json'
    );
  });

  it("should save config when folder doesn't exist", () => {
    process.env.APPDATA = 'C:\\Users\\user\\AppData\\Roaming';
    (fs.existsSync as any).mockReturnValue(false);
    (fs.mkdirSync as any).mockImplementation(() => 'folder');
    (fs.writeFileSync as any).mockImplementation();

    saveConfig({ apps: [], debugLogging: false });
    expect(fs.mkdirSync).toHaveBeenCalledWith('C:\\Users\\user\\AppData\\Roaming\\cobu', {
      recursive: true,
    });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'C:\\Users\\user\\AppData\\Roaming\\cobu\\cobu_config.json',
      JSON.stringify({ apps: [] }, undefined, 2)
    );
  });

  it('should get flags that provide variable', () => {
    const node = getFlagsThatProvideVariable('${testVar}', {
      name: 'testApp',
      flags: [
        {
          name: 'testFlag',
          instructions: [
            {
              type: AppActionType.SetVariable,
              name: 'testVar',
              value: 'testValue',
              arg: 'arg',
            },
          ],
        },
      ],
    });
    expect(node).toEqual([
      {
        instructions: [{ arg: 'arg', name: 'testVar', type: 'SetVariable', value: 'testValue' }],
        name: 'testFlag',
      },
    ]);
  });
});
