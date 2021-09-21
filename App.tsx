import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import { Dashboard } from './src/screens/Dashboard';
import { StatusBar } from 'react-native'

import { Routes } from './src/Routes/index';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import AppLoading from 'expo-app-loading'

import { ThemeProvider } from 'styled-components'
import Theme from './src/global/styles/theme'
import { Register } from './src/screens/Register';
import { CategorySelect } from './src/screens/CategorySelect';

import { AppRoutes } from './src/Routes/app.routes';
import { SignIn } from './src/screens/SignIn';

import { AuthProvider, useAuth } from './src/hooks/auth';


export default function App() {

  const { isLoading } = useAuth()

  const [fonstLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium, 
    Poppins_700Bold
  });


  if (!fonstLoaded || isLoading) {
    return <AppLoading />
  }


  return (
    <ThemeProvider theme={Theme}>
        <StatusBar barStyle='light-content' />
        <AuthProvider>
          <Routes/>
        </AuthProvider>
        
    </ThemeProvider>
  );
}
