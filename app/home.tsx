import { exportDataToExcel } from '@/utils/excel';
import { Link, Stack, useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import { useEffect } from 'react';
import { getStoragePermission } from '@/utils/tools';
export default function Page() {
  const router = useRouter();

  const run = async () => {
    nodejs.channel.send('A message!');
    const node = nodejs.start('sample-main.js');
    console.log(node);
  };

  return (
    <>
      <Text>home page</Text>
      <Button onPress={() => router.push({ pathname: '/home' })} title="跳转"></Button>
      <View style={{ marginTop: 20 }}>
        <Button onPress={() => exportDataToExcel('default')} title="excel"></Button>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Message Node" onPress={run} />
      </View>
    </>
  );
}
