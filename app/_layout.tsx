import '../tamagui-web.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme, StatusBar } from 'react-native';
import {} from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
type ColorSchemeName = 'light' | 'dark' | null | undefined;
export default function Layout() {
  const colorScheme = useColorScheme();
  // dark light
  // const colorScheme: ColorSchemeName = 'dark';
  useEffect(() => {
    if (colorScheme == 'dark') {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, [colorScheme]);
  return (
    <>
      <RootSiblingParent>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <ThemeProvider value={colorScheme == 'dark' ? DarkTheme : DefaultTheme}>
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
      </RootSiblingParent>
    </>
  );
}
