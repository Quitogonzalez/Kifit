import './global.css'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { router, Stack } from 'expo-router'
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue'
import {
  Barlow_400Regular,
  Barlow_600SemiBold,
  Barlow_700Bold,
} from '@expo-google-fonts/barlow'
import * as SplashScreen from 'expo-splash-screen'
import { useAuthStore } from '@/stores/useAuthStore'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Barlow_400Regular,
    Barlow_600SemiBold,
    Barlow_700Bold,
  })

  const { initialize, isLoading, isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    if (!fontsLoaded || isLoading) return

    // #region agent log
    fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'_layout.tsx:redirect effect',message:'auth redirect',data:{isAuthenticated,hasUser:!!user,userRole:user?.role},hypothesisId:'H5',timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!isAuthenticated) {
      router.replace('/(auth)/welcome')
    } else if (user?.role === 'coach') {
      router.replace('/(coach)/')
    } else if (user?.role === 'athlete') {
      router.replace('/(athlete)/')
    }
  }, [fontsLoaded, isLoading, isAuthenticated, user])

  if (!fontsLoaded) return null

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator color="#22C55E" size="large" />
      </View>
    )
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

export default RootLayout
