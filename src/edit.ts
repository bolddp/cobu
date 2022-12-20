import open from 'open';
import { getConfigFilePath } from './Configuration';
import { dialog } from './dialog';
import { loc } from './loc/Loc';
import { log } from './log';

export const editApplication = async () => {
  const confirm = await dialog.yesNo(loc.confirmEditApplication);
  if (!confirm) {
    return;
  }
  const filePath = getConfigFilePath();
  log.info('Opening cobu config file for editing');
  await open(filePath);
};
