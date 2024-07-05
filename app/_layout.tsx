import '../tamagui-web.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
export default function Layout() {
  // const colorScheme = useColorScheme();
  // dark light
  const colorScheme: 'light' | 'dark' = 'dark';
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme == 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme == 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerLargeTitle: true,
              title: 'Run NodeJS',
            }}
          />
          <Stack.Screen
            name="home"
            options={{
              headerLargeTitle: true,
              title: 'Home Router',
            }}
          />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
