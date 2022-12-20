export const commands = {
  config: ['config', 'configure'],
  delete: ['delete', 'del'],
  list: ['list'],
  edit: ['edit'],
  debug: ['debug'],
  help: ['--help', 'help'],
};

/**
 * Checks if a value is a command, which means it can't be used for
 * application names etc.
 */
export const isCommand = (value: string): boolean => {
  return Object.values(commands).some((c) =>
    c.some((variant) => variant == (value ?? '').toLowerCase())
  );
};
