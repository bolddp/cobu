export const options = {
  add: 'add',
  description: 'description',
};

/**
 * Checks if a value is an option
 */
export const isOption = (value: string): boolean => {
  return Object.values(options).some((c) => c == (value ?? '').toLowerCase());
};
