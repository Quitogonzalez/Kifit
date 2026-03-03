import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/stores/useAuthStore'

const LABEL_EMAIL = 'Correo electrónico'
const PLACEHOLDER_EMAIL = 'email@email.com'
const LABEL_PASSWORD = 'Contraseña'
const PLACEHOLDER_PASSWORD = '••••••••••'
const LABEL_REMEMBER = 'Recordarme'
const LINK_RECOVER = 'Recuperar contraseña'
const BTN_LOGIN = 'Iniciar sesión'
const SEPARATOR = 'o'
const BTN_GOOGLE = 'Continuar con Google'
const BTN_APPLE = 'Continuar con Apple'
const LINK_REGISTER_PREFIX = '¿No tienes cuenta?  '
const LINK_REGISTER = 'Registrarse'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signInWithGoogle, signInWithApple, isLoading } = useAuthStore()

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Completa todos los campos.')
      return
    }
    setError('')
    try {
      await signIn(email, password)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Ocurrió un error. Intenta de nuevo.')
      }
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithGoogle()
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('No se pudo iniciar sesión con Google.')
      }
    }
  }

  const handleApple = async () => {
    setError('')
    try {
      await signInWithApple()
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('No se pudo iniciar sesión con Apple.')
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ flex: 0.35, alignItems: 'center', justifyContent: 'center', paddingTop: 24, paddingBottom: 32 }}>
            {/* Botón volver */}
            <Pressable
              onPress={() => router.back()}
              style={{ position: 'absolute', top: 16, left: 20, padding: 8, zIndex: 10 }}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={22} color="#64748B" />
            </Pressable>
            {/* Anillos decorativos */}
            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
              {[200, 150, 100].map((size) => (
                <View
                  key={size}
                  style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 1,
                    borderColor: 'rgba(34, 197, 94, 0.08)',
                  }}
                />
              ))}
            </View>
            <Text
              style={{
                fontFamily: 'BebasNeue_400Regular',
                fontSize: 64,
                color: '#22C55E',
                letterSpacing: 5,
                textShadowColor: 'rgba(34, 197, 94, 0.35)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 24,
              }}
            >
              KIFIT
            </Text>
          </View>

          {/* Card de formulario */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#0F172A',
              borderTopWidth: 1,
              borderTopColor: 'rgba(51, 65, 85, 0.8)',
              paddingHorizontal: 28,
              paddingTop: 32,
              paddingBottom: 32,
            }}
          >
            <Text
              style={{
                fontFamily: 'BebasNeue_400Regular',
                fontSize: 36,
                color: '#F8FAFC',
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              Iniciar sesión
            </Text>
            <Text
              style={{
                fontFamily: 'Barlow_400Regular',
                fontSize: 14,
                color: '#64748B',
                marginBottom: 28,
              }}
            >
              Ingresa tus datos para continuar
            </Text>

            {/* Campo email */}
            <Text
              style={{ fontFamily: 'Barlow_600SemiBold', fontSize: 13, color: '#94A3B8', marginBottom: 8 }}
            >
              {LABEL_EMAIL}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1E293B',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#334155',
                paddingHorizontal: 16,
                height: 54,
                marginBottom: 18,
              }}
            >
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={PLACEHOLDER_EMAIL}
                placeholderTextColor="#475569"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  flex: 1,
                  color: '#F8FAFC',
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 15,
                }}
              />
              <Ionicons name="mail-outline" size={18} color="#475569" />
            </View>

            {/* Campo contraseña */}
            <Text
              style={{ fontFamily: 'Barlow_600SemiBold', fontSize: 13, color: '#94A3B8', marginBottom: 8 }}
            >
              {LABEL_PASSWORD}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1E293B',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#334155',
                paddingHorizontal: 16,
                height: 54,
                marginBottom: 16,
              }}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={PLACEHOLDER_PASSWORD}
                placeholderTextColor="#475569"
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  color: '#F8FAFC',
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 15,
                }}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color="#475569"
                />
              </Pressable>
            </View>

            {/* Recordarme + Recuperar contraseña */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <Pressable
                onPress={() => setRememberMe((v) => !v)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    borderWidth: 1.5,
                    borderColor: rememberMe ? '#22C55E' : '#334155',
                    backgroundColor: rememberMe ? '#22C55E' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {rememberMe && <Ionicons name="checkmark" size={13} color="#0F172A" />}
                </View>
                <Text
                  style={{ fontFamily: 'Barlow_400Regular', fontSize: 13, color: '#94A3B8' }}
                >
                  {LABEL_REMEMBER}
                </Text>
              </Pressable>
              <Pressable>
                <Text
                  style={{ fontFamily: 'Barlow_600SemiBold', fontSize: 13, color: '#22C55E' }}
                >
                  {LINK_RECOVER}
                </Text>
              </Pressable>
            </View>

            {/* Error */}
            {error !== '' && (
              <Text
                style={{
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 13,
                  color: '#EF4444',
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                {error}
              </Text>
            )}

            {/* Botón primario */}
            <Pressable
              onPress={handleSignIn}
              disabled={isLoading}
              className="bg-green-500 h-14 rounded-2xl items-center justify-center mb-6 active:opacity-80"
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <Text
                style={{
                  fontFamily: 'Barlow_700Bold',
                  fontSize: 16,
                  color: '#0F172A',
                  letterSpacing: 0.5,
                }}
              >
                {BTN_LOGIN}
              </Text>
            </Pressable>

            {/* Separador */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
              <Text
                style={{
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 13,
                  color: '#475569',
                  marginHorizontal: 14,
                }}
              >
                {SEPARATOR}
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
            </View>

            {/* OAuth — Google */}
            <Pressable
              onPress={handleGoogle}
              disabled={isLoading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#334155',
                backgroundColor: '#1E293B',
                marginBottom: 12,
                gap: 10,
              }}
              className="active:opacity-70"
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text
                style={{
                  fontFamily: 'Barlow_600SemiBold',
                  fontSize: 15,
                  color: '#CBD5E1',
                }}
              >
                {BTN_GOOGLE}
              </Text>
            </Pressable>

            {/* OAuth — Apple */}
            <Pressable
              onPress={handleApple}
              disabled={isLoading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#334155',
                backgroundColor: '#1E293B',
                marginBottom: 28,
                gap: 10,
              }}
              className="active:opacity-70"
            >
              <Ionicons name="logo-apple" size={20} color="#F8FAFC" />
              <Text
                style={{
                  fontFamily: 'Barlow_600SemiBold',
                  fontSize: 15,
                  color: '#CBD5E1',
                }}
              >
                {BTN_APPLE}
              </Text>
            </Pressable>

            {/* Ir a registro */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text
                style={{ fontFamily: 'Barlow_400Regular', fontSize: 14, color: '#475569' }}
              >
                {LINK_REGISTER_PREFIX}
              </Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text
                  style={{
                    fontFamily: 'Barlow_600SemiBold',
                    fontSize: 14,
                    color: '#22C55E',
                  }}
                >
                  {LINK_REGISTER}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen
