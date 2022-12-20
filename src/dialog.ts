import * as readline from 'readline';

export const dialog = {
  yesNo: async (question: string): Promise<boolean> => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const response = await new Promise<string>((resolve) => {
      rl.question(`${question} `, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
    return (response ?? '').toLowerCase().startsWith('y');
  },
};
