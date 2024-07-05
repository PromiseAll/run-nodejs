import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, Image, FlatList, ToastAndroid } from 'react-native';
import Toast from 'react-native-root-toast';
import nodejs from 'nodejs-mobile-react-native';
import { useEffect, useRef, useState } from 'react';
import { getStoragePermission } from '@/utils/tools';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { View, Text, Input, Button, YStack, useTheme } from 'tamagui';
const testPath = ReactNativeBlobUtil.fs.dirs.DocumentDir + '/nodejs-project/test.js';
console.log(testPath);

export default function Page() {
  const router = useRouter();
  const theme = useTheme();

  const [logData, setLogData] = useState<any>([]);
  // 手动输入路径
  const [modulePath, setModulePath] = useState(testPath);
  const scrollViewRef = useRef(null);
  useEffect(() => {
    const fn = msg => {
      console.log('From node: ' + msg);
      // 使用函数式更新
      setLogData(logData => [...logData, JSON.parse(msg)]);
      // react-native 滚动条滚动到最底部
    };
    (async () => {
      await getStoragePermission();
      nodejs.start('dist/main.cjs');
      nodejs.channel.addListener('message', fn);
    })();
    // 注意：这里我们可能还需要处理组件卸载时移除监听器的逻辑，以避免内存泄漏
    return () => {
      console.log('组件卸载时移除监听器');
      nodejs.channel?.removeListener?.('message', fn);
    };
  }, []);

  const run = async () => {
    nodejs.channel.send(
      JSON.stringify({
        type: 'run',
        modulePath: modulePath,
        callFnName: 'main',
      })
    );
  };

  const clearLogs = () => {
    setLogData([]);
    nodejs.channel.send(
      JSON.stringify({
        type: 'clearModuleCache',
      })
    );
    // 使用toast
    Toast.show('清除成功');
  };

  return (
    <YStack gap="$2" height="100%" padding="$2">
      <View>
        <Input
          value={modulePath}
          onChangeText={setModulePath}
          placeholder="请输入模块路径或URL"
          clearTextOnFocus={true}
          clearButtonMode="always"
          style={{ borderWidth: 1, borderColor: 'black', padding: 10 }}
        />
      </View>
      <View>
        <Button
          themeInverse
          backgroundColor="$color6"
          onPress={() => {
            clearLogs();
          }}>
          清除日志和缓存
        </Button>
      </View>
      <View>
        <Button backgroundColor="$color6" themeInverse onPress={run}>
          运行
        </Button>
      </View>
      <View style={{ flex: 1 }} backgroundColor="$color2" padding="$2">
        <FlatList
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          data={logData}
          renderItem={({ item, index }) => {
            return (
              <View key={index}>
                <Text
                  style={{
                    color: {
                      log: theme.blue10.val,
                      error: theme.red10.val,
                    }[item.type],
                  }}>{`[${item.type}]:${item.content}`}</Text>
              </View>
            );
          }}></FlatList>
      </View>
    </YStack>
  );
}
