import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import { useEffect, useRef, useState } from 'react';
import { getStoragePermission } from '@/utils/tools';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { View, Text, Input, Button, YStack, SizableText, Paragraph, Theme } from 'tamagui';
const testPath = ReactNativeBlobUtil.fs.dirs.DocumentDir + '/nodejs-project/test.js';
console.log(testPath);

export default function Page() {
  const router = useRouter();
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
  };

  return (
    <YStack
      gap="$2"
      backgroundColor="$color11"
      style={{ padding: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* <Button onPress={() => router.push({ pathname: '/home' })} title="跳转Home"></Button>
      <View style={{ marginTop: 20 }}>
        <Button onPress={() => exportDataToExcel('default')} title="导出excel"></Button>
      </View> */}
      {/* 输入框 */}
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
      <View style={{ flex: 1 }} backgroundColor="$color10">
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
          <Text>{logData.map(v => `${v.type}:${v.content}`).join('\n')}</Text>
        </ScrollView>
      </View>
    </YStack>
  );
}
