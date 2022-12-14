import { classifyArgs } from '../src/classifyArgs';

describe('classifyArgs', () => {
  it('will classify args', () => {
    const args = classifyArgs([
      '$variable=value',
      '$var1_2=value2',
      '${variableName}',
      '${var1_2}',
      'https://www.github.com',
      '> firefox ${url} ${arg2}',
      'flag',
      '--description',
      'This is the description',
      'And finally some text',
    ]);

    expect(args).toEqual([
      { name: 'variable', source: '$variable=value', type: 'varAssignment', value: 'value' },
      { name: 'var1_2', source: '$var1_2=value2', type: 'varAssignment', value: 'value2' },
      { name: 'variableName', source: '${variableName}', type: 'varStatement', value: undefined },
      { name: 'var1_2', source: '${var1_2}', type: 'varStatement', value: undefined },
      { source: 'https://www.github.com', type: 'url', value: 'https://www.github.com' },
      {
        name: 'firefox',
        source: '> firefox ${url} ${arg2}',
        type: 'AppReference',
        value: '${url} ${arg2}',
      },
      { name: 'flag', source: 'flag', type: 'flag' },
      { source: '--description', type: 'description', value: 'This is the description' },
      { source: 'And finally some text', type: 'text', value: 'And finally some text' },
    ]);
  });
});
