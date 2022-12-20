import chalk from 'chalk';

let logDebug: boolean = false;

export const log = {
  debug: (msg: string) => logDebug && console.log(chalk.gray(msg)),
  info: (msg: string) => console.log(chalk.white(msg)),
  warn: (msg: string) => console.log(chalk.yellow(msg)),
  error: (msg: string) => console.log(chalk.red(msg)),
};

export const getDebugLogging = () => logDebug;
export const setDebugLogging = (value: boolean) => {
  logDebug = value;
};
