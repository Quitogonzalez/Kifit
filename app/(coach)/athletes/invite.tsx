import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/stores/useAuthStore'
import { inviteAthleteByEmail } from '@/lib/teams'

const TITLE = 'Invitar atleta'
const SUBTITLE = 'Ingresa el correo del atleta que quieres agregar a tu equipo.'
const LABEL_EMAIL = 'Correo del atleta'
const PLACEHOLDER_EMAIL = 'atleta@email.com'
const BTN_INVITE = 'Invitar'
const SUCCESS_PREFIX = '¡Listo! '
const SUCCESS_SUFFIX = ' fue agregado a tu equipo.'

const InviteAthleteScreen = () => {
  const teamId = useAuthStore((state) => state.teamId)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInvite = async () => {
    if (!email.trim()) {
      setError('Ingresa el correo del atleta.')
      return
    }

    if (!teamId) {
      setError('No se encontró tu equipo. Cierra sesión e intenta de nuevo.')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const result = await inviteAthleteByEmail(teamId, email)

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.success && result.athlete) {
        setSuccess(`${SUCCESS_PREFIX}${result.athlete.full_name}${SUCCESS_SUFFIX}`)
        setEmail('')
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'No se pudo invitar al atleta. Intenta de nuevo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-2 flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="p-2 -ml-2 active:opacity-70"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#64748B" />
          </Pressable>
          <Text
            style={{
              fontFamily: 'BebasNeue_400Regular',
              fontSize: 28,
              color: '#F8FAFC',
              letterSpacing: 1,
            }}
          >
            {TITLE}
          </Text>
        </View>

        <View className="px-6 pt-6 flex-1">
          <Text
            style={{
              fontFamily: 'Barlow_400Regular',
              fontSize: 15,
              color: '#64748B',
              lineHeight: 22,
              marginBottom: 28,
            }}
          >
            {SUBTITLE}
          </Text>

          {/* Campo email */}
          <Text
            style={{
              fontFamily: 'Barlow_600SemiBold',
              fontSize: 13,
              color: '#94A3B8',
              marginBottom: 8,
            }}
          >
            {LABEL_EMAIL}
          </Text>
          <View className="flex-row items-center bg-slate-800 rounded-2xl border border-slate-700 px-4 h-14 mb-6">
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                setError('')
                setSuccess('')
              }}
              placeholder={PLACEHOLDER_EMAIL}
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              style={{
                flex: 1,
                color: '#F8FAFC',
                fontFamily: 'Barlow_400Regular',
                fontSize: 15,
              }}
            />
            <Ionicons name="mail-outline" size={18} color="#475569" />
          </View>

          {/* Error */}
          {error !== '' && (
            <View className="bg-red-500/10 rounded-xl p-3 mb-4 flex-row items-center gap-2">
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text
                style={{
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 13,
                  color: '#EF4444',
                  flex: 1,
                }}
              >
                {error}
              </Text>
            </View>
          )}

          {/* Éxito */}
          {success !== '' && (
            <View className="bg-green-500/10 rounded-xl p-3 mb-4 flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
              <Text
                style={{
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 13,
                  color: '#22C55E',
                  flex: 1,
                }}
              >
                {success}
              </Text>
            </View>
          )}

          {/* Botón invitar */}
          <Pressable
            onPress={handleInvite}
            disabled={isLoading || !email.trim()}
            className="bg-green-500 h-14 rounded-2xl items-center justify-center active:opacity-80"
            style={{ opacity: isLoading || !email.trim() ? 0.5 : 1 }}
          >
            <Text
              style={{
                fontFamily: 'Barlow_700Bold',
                fontSize: 16,
                color: '#0F172A',
                letterSpacing: 0.5,
              }}
            >
              {isLoading ? 'Invitando...' : BTN_INVITE}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default InviteAthleteScreen
