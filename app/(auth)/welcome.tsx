import { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const TAGLINE_1 = 'Entrena inteligente.'
const TAGLINE_2 = 'Progresa con propósito.'
const TITLE_LINE_1 = 'Bienvenido a'
const TITLE_LINE_2 = 'Kifit'
const SUBTITLE = 'La plataforma donde coaches y atletas\nentrenan en serio.'
const BTN_REGISTER = 'Crear cuenta'
const BTN_LOGIN = 'Iniciar sesión'
const LEGAL = 'Al registrarte aceptas los Términos y la Política de Privacidad.'

const WelcomeScreen = () => {
  const heroOpacity = useSharedValue(0)
  const heroTranslate = useSharedValue(30)
  const cardOpacity = useSharedValue(0)
  const cardTranslate = useSharedValue(50)

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 700 })
    heroTranslate.value = withSpring(0, { damping: 18 })
    cardOpacity.value = withDelay(300, withTiming(1, { duration: 600 }))
    cardTranslate.value = withDelay(300, withSpring(0, { damping: 20 }))
  }, [])

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslate.value }],
  }))

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslate.value }],
  }))

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      {/* Hero */}
      <Animated.View style={[heroStyle, { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }]}>

        {/* Anillos concéntricos decorativos */}
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          {[280, 220, 160, 100].map((size, i) => (
            <View
              key={size}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 1,
                borderColor: `rgba(34, 197, 94, ${0.06 + i * 0.04})`,
              }}
            />
          ))}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(34, 197, 94, 0.22)',
              }}
            />
          </View>
        </View>

        {/* Logo */}
        <View style={{ alignItems: 'center', zIndex: 10 }}>
          <Text
            style={{
              fontFamily: 'BebasNeue_400Regular',
              fontSize: 88,
              color: '#22C55E',
              letterSpacing: 6,
              textShadowColor: 'rgba(34, 197, 94, 0.45)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 30,
              lineHeight: 88,
            }}
          >
            KIFIT
          </Text>
          <View style={{ alignItems: 'center', marginTop: 10, gap: 3 }}>
            {[TAGLINE_1, TAGLINE_2].map((line) => (
              <Text
                key={line}
                style={{
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 11,
                  color: '#475569',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {line}
              </Text>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Card inferior */}
      <Animated.View
        style={[
          cardStyle,
          {
            backgroundColor: '#0F172A',
            borderTopWidth: 1,
            borderTopColor: 'rgba(51, 65, 85, 0.8)',
            paddingHorizontal: 28,
            paddingTop: 36,
            paddingBottom: 36,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: 'BebasNeue_400Regular',
            fontSize: 34,
            color: '#F8FAFC',
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          {TITLE_LINE_1} {TITLE_LINE_2}
        </Text>
        <Text
          style={{
            fontFamily: 'Barlow_400Regular',
            fontSize: 15,
            color: '#64748B',
            lineHeight: 22,
            marginBottom: 32,
          }}
        >
          {SUBTITLE}
        </Text>

        {/* Botón primario — Crear cuenta */}
        <Pressable
          onPress={() => router.push('/(auth)/register')}
          className="bg-green-500 h-14 rounded-2xl items-center justify-center mb-3 active:opacity-80"
        >
          <Text
            style={{
              fontFamily: 'Barlow_700Bold',
              fontSize: 16,
              color: '#0F172A',
              letterSpacing: 0.5,
            }}
          >
            {BTN_REGISTER}
          </Text>
        </Pressable>

        {/* Botón secundario — Iniciar sesión */}
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          style={{
            height: 56,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#334155',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
          className="active:opacity-70"
        >
          <Text
            style={{
              fontFamily: 'Barlow_600SemiBold',
              fontSize: 16,
              color: '#94A3B8',
              letterSpacing: 0.5,
            }}
          >
            {BTN_LOGIN}
          </Text>
        </Pressable>

        {/* Disclaimer */}
        <Text
          style={{
            fontFamily: 'Barlow_400Regular',
            fontSize: 11,
            color: '#475569',
            textAlign: 'center',
            lineHeight: 16,
          }}
        >
          {LEGAL}
        </Text>
      </Animated.View>
    </SafeAreaView>
  )
}

export default WelcomeScreen
