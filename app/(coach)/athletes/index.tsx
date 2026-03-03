import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/stores/useAuthStore'
import { getTeamAthletes } from '@/lib/teams'
import type { AthleteWithProfile } from '@/types'

const TITLE = 'Atletas'
const EMPTY_MESSAGE = 'Aún no tienes atletas registrados.'
const EMPTY_HINT = 'Invita a tus atletas para empezar a entrenar.'
const BTN_INVITE = 'Invitar atleta'
const ERROR_RETRY = 'Reintentar'
const LABEL_NO_DATA = 'Sin datos físicos'

const AthletesListScreen = () => {
  const teamId = useAuthStore((state) => state.teamId)
  const [athletes, setAthletes] = useState<AthleteWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAthletes = useCallback(async () => {
    if (!teamId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const data = await getTeamAthletes(teamId)
      setAthletes(data)
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'No se pudieron cargar los atletas.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [teamId])

  useEffect(() => {
    fetchAthletes()
  }, [fetchAthletes])

  const renderAthleteItem = ({ item }: { item: AthleteWithProfile }) => (
    <Pressable
      onPress={() =>
        router.push(`/(coach)/athletes/${item.profiles.id}`)
      }
      className="bg-slate-800 rounded-2xl p-4 mb-3 active:opacity-80"
    >
      <View className="flex-row items-center gap-3">
        {/* Avatar placeholder */}
        <View className="w-11 h-11 rounded-full bg-green-500/10 items-center justify-center">
          <Text
            style={{
              fontFamily: 'Barlow_700Bold',
              fontSize: 16,
              color: '#22C55E',
            }}
          >
            {item.profiles.full_name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            style={{
              fontFamily: 'Barlow_600SemiBold',
              fontSize: 16,
              color: '#F8FAFC',
            }}
          >
            {item.profiles.full_name}
          </Text>
          <Text
            style={{
              fontFamily: 'Barlow_400Regular',
              fontSize: 13,
              color: '#64748B',
            }}
          >
            {item.profiles.email}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#475569" />
      </View>
    </Pressable>
  )

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8 pt-20">
      <View className="bg-slate-800/50 rounded-full p-5 mb-5">
        <Ionicons name="people-outline" size={40} color="#475569" />
      </View>
      <Text
        style={{
          fontFamily: 'Barlow_600SemiBold',
          fontSize: 17,
          color: '#94A3B8',
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        {EMPTY_MESSAGE}
      </Text>
      <Text
        style={{
          fontFamily: 'Barlow_400Regular',
          fontSize: 14,
          color: '#475569',
          textAlign: 'center',
          marginBottom: 28,
        }}
      >
        {EMPTY_HINT}
      </Text>
      <Pressable
        onPress={() => router.push('/(coach)/athletes/invite')}
        className="bg-green-500 rounded-2xl px-8 py-4 active:opacity-80"
      >
        <Text
          style={{
            fontFamily: 'Barlow_700Bold',
            fontSize: 15,
            color: '#0F172A',
          }}
        >
          {BTN_INVITE}
        </Text>
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
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
        <Pressable
          onPress={() => router.push('/(coach)/athletes/invite')}
          className="bg-green-500/10 rounded-xl p-2.5 active:opacity-70"
        >
          <Ionicons name="person-add" size={20} color="#22C55E" />
        </Pressable>
      </View>

      {/* Contenido */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#22C55E" size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text
            style={{
              fontFamily: 'Barlow_400Regular',
              fontSize: 15,
              color: '#EF4444',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            {error}
          </Text>
          <Pressable
            onPress={fetchAthletes}
            className="bg-slate-800 rounded-xl px-6 py-3 active:opacity-70"
          >
            <Text
              style={{
                fontFamily: 'Barlow_600SemiBold',
                fontSize: 14,
                color: '#94A3B8',
              }}
            >
              {ERROR_RETRY}
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={athletes}
          keyExtractor={(item) => item.athlete_id}
          renderItem={renderAthleteItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

export default AthletesListScreen
