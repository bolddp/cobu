import { isOption } from '../src/options';

describe('options', () => {
  it('should check isOption', () => {
    expect(isOption('what')).toEqual(false);
    expect(isOption('description')).toEqual(true);
  });
});
