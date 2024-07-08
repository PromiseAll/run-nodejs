import * as Updates from 'expo-updates';
import { Alert } from 'react-native';
export async function onFetchUpdateAsync() {
  console.log(5);
  try {
    const update = await Updates.checkForUpdateAsync();
    console.log(update);
    if (update.isAvailable) {
      Alert.alert('发现新的版本', `${update}`, [
        {
          text: '更新',
          onPress: async () => {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          },
        },
        {
          text: '取消',
        },
      ]);
    } else {
      Alert.alert('已经是最新版本', `${update}`, [{ text: '确定' }]);
    }
  } catch (error) {
    Alert.alert('更新发生错误', `${error}`, [{ text: '确定' }]);
  }
}
