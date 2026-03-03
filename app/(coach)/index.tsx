import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/stores/useAuthStore'

const GREETING_PREFIX = 'Hola, '
const CARD_ATHLETES_TITLE = 'Atletas'
const CARD_ATHLETES_DESC = 'Gestiona a los atletas que entrenas'
const CARD_CALENDAR_TITLE = 'Calendario'
const CARD_CALENDAR_DESC = 'Próximamente'

const CoachHomeScreen = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-2 flex-row items-center justify-between">
          <View>
            <Text
              style={{
                fontFamily: 'BebasNeue_400Regular',
                fontSize: 28,
                color: '#22C55E',
                letterSpacing: 3,
              }}
            >
              KIFIT
            </Text>
            <Text
              style={{
                fontFamily: 'Barlow_400Regular',
                fontSize: 13,
                color: '#64748B',
              }}
            >
              Coach
            </Text>
          </View>
        </View>

        {/* Saludo */}
        <View className="px-6 pt-4 pb-8">
          <Text
            style={{
              fontFamily: 'BebasNeue_400Regular',
              fontSize: 36,
              color: '#F8FAFC',
              letterSpacing: 1,
            }}
          >
            {GREETING_PREFIX}
          </Text>
          <Text
            style={{
              fontFamily: 'BebasNeue_400Regular',
              fontSize: 36,
              color: '#22C55E',
              letterSpacing: 1,
            }}
          >
            {user?.full_name ?? 'Coach'}
          </Text>
        </View>

        {/* Cards */}
        <View className="px-6 gap-4">
          {/* Atletas */}
          <Pressable
            onPress={() => router.push('/(coach)/athletes')}
            className="bg-slate-800 rounded-2xl p-5 active:opacity-80"
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-green-500/10 rounded-xl p-2.5">
                <Ionicons name="people" size={24} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: 'Barlow_700Bold',
                    fontSize: 18,
                    color: '#F8FAFC',
                  }}
                >
                  {CARD_ATHLETES_TITLE}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Barlow_400Regular',
                    fontSize: 13,
                    color: '#64748B',
                  }}
                >
                  {CARD_ATHLETES_DESC}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#475569" />
            </View>
          </Pressable>

          {/* Calendario (placeholder) */}
          <View className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-600/10 rounded-xl p-2.5">
                <Ionicons name="calendar" size={24} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: 'Barlow_700Bold',
                    fontSize: 18,
                    color: '#64748B',
                  }}
                >
                  {CARD_CALENDAR_TITLE}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Barlow_400Regular',
                    fontSize: 13,
                    color: '#475569',
                  }}
                >
                  {CARD_CALENDAR_DESC}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CoachHomeScreen
