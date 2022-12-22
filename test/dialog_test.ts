jest.mock('readline');

import readline from 'readline';
import { dialog } from '../src/dialog';

describe('dialog', () => {
  it('should ask yes/no', async () => {
    readline.createInterface = jest.fn().mockReturnValue({
      question: jest.fn().mockImplementation((question, answer) => {
        answer('y');
      }),
      close: jest.fn(),
    });
    const value = await dialog.yesNo('Wassup?');

    expect(value).toEqual(true);
  });
});
