import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/stores/useAuthStore'

const TITLE = 'Perfil'
const SECTION_ACCOUNT = 'Cuenta'
const SECTION_TEAM = 'Tu equipo'
const LABEL_NAME = 'Nombre'
const LABEL_EMAIL = 'Correo'
const LABEL_ROLE = 'Rol'
const LABEL_INVITE_CODE = 'Código de invitación'
const INVITE_CODE_HINT = 'Comparte este código con tus atletas para que se unan.'
const BTN_SIGNOUT = 'Cerrar sesión'
const ROLE_COACH = 'Coach'

const CoachProfileScreen = () => {
  const user = useAuthStore((state) => state.user)
  const inviteCode = useAuthStore((state) => state.inviteCode)
  const signOut = useAuthStore((state) => state.signOut)

  const handleSignOut = async () => {
    await signOut()
    router.replace('/(auth)/welcome')
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-6">
          <Text
            style={{
              fontFamily: 'BebasNeue_400Regular',
              fontSize: 32,
              color: '#F8FAFC',
              letterSpacing: 1,
            }}
          >
            {TITLE}
          </Text>
        </View>

        {/* Avatar + nombre */}
        <View className="items-center pb-8">
          <View className="w-20 h-20 rounded-full bg-green-500/10 items-center justify-center mb-4">
            <Text
              style={{
                fontFamily: 'BebasNeue_400Regular',
                fontSize: 32,
                color: '#22C55E',
              }}
            >
              {user?.full_name?.charAt(0)?.toUpperCase() ?? 'C'}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Barlow_700Bold',
              fontSize: 20,
              color: '#F8FAFC',
            }}
          >
            {user?.full_name ?? 'Coach'}
          </Text>
          <Text
            style={{
              fontFamily: 'Barlow_400Regular',
              fontSize: 14,
              color: '#64748B',
              marginTop: 2,
            }}
          >
            {user?.email}
          </Text>
        </View>

        {/* Sección Cuenta */}
        <View className="px-6 pb-6">
          <Text
            style={{
              fontFamily: 'Barlow_600SemiBold',
              fontSize: 12,
              color: '#475569',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            {SECTION_ACCOUNT}
          </Text>
          <View className="bg-slate-800 rounded-2xl overflow-hidden">
            <ProfileRow label={LABEL_NAME} value={user?.full_name ?? ''} />
            <View className="h-px bg-slate-700/50 mx-4" />
            <ProfileRow label={LABEL_EMAIL} value={user?.email ?? ''} />
            <View className="h-px bg-slate-700/50 mx-4" />
            <ProfileRow label={LABEL_ROLE} value={ROLE_COACH} />
          </View>
        </View>

        {/* Sección Equipo — Código de invitación */}
        {inviteCode && (
          <View className="px-6 pb-6">
            <Text
              style={{
                fontFamily: 'Barlow_600SemiBold',
                fontSize: 12,
                color: '#475569',
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {SECTION_TEAM}
            </Text>
            <View className="bg-slate-800 rounded-2xl p-5">
              <Text
                style={{
                  fontFamily: 'Barlow_600SemiBold',
                  fontSize: 13,
                  color: '#94A3B8',
                  marginBottom: 10,
                }}
              >
                {LABEL_INVITE_CODE}
              </Text>
              <View className="bg-slate-900 rounded-xl p-4 items-center mb-3">
                <Text
                  style={{
                    fontFamily: 'BebasNeue_400Regular',
                    fontSize: 36,
                    color: '#22C55E',
                    letterSpacing: 8,
                  }}
                >
                  {inviteCode}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 12,
                  color: '#475569',
                  textAlign: 'center',
                }}
              >
                {INVITE_CODE_HINT}
              </Text>
            </View>
          </View>
        )}

        {/* Cerrar sesión */}
        <View className="px-6 pb-10">
          <Pressable
            onPress={handleSignOut}
            className="bg-red-500/10 rounded-2xl h-14 items-center justify-center active:opacity-80"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text
                style={{
                  fontFamily: 'Barlow_600SemiBold',
                  fontSize: 15,
                  color: '#EF4444',
                }}
              >
                {BTN_SIGNOUT}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center justify-between px-4 py-3.5">
    <Text
      style={{
        fontFamily: 'Barlow_400Regular',
        fontSize: 14,
        color: '#64748B',
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontFamily: 'Barlow_600SemiBold',
        fontSize: 14,
        color: '#F8FAFC',
      }}
    >
      {value}
    </Text>
  </View>
)

export default CoachProfileScreen
