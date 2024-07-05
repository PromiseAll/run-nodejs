import { PermissionsAndroid } from 'react-native';
import { requestManagePermission, checkManagePermission } from 'manage-external-storage';

export const getStoragePermission = async () => {
  try {
    // android 11 读写权限
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      // PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
    ]);
    !(await checkManagePermission()) && (await requestManagePermission());
  } catch (err) {
    console.warn(err);
  }
  const manageGranted = await checkManagePermission();
  const readGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
  );
  const writeGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );

  if (!readGranted || !writeGranted || !manageGranted) {
    console.log('Read and write permissions have not been granted');
    return false;
  }
  return true;
};
