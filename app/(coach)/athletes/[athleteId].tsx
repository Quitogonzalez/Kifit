import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getAthleteDetail } from '@/lib/teams'
import type { AthleteDetail } from '@/types'

const LABEL_EMAIL = 'Correo electrónico'
const LABEL_WEIGHT = 'Peso'
const LABEL_HEIGHT = 'Altura'
const LABEL_BIRTHDATE = 'Fecha de nacimiento'
const LABEL_NO_DATA = 'Sin registrar'
const BTN_CALENDAR = 'Ver calendario'
const BTN_NOTES = 'Notas'
const UNIT_KG = 'kg'
const UNIT_CM = 'cm'

const AthleteDetailScreen = () => {
  const { athleteId } = useLocalSearchParams<{ athleteId: string }>()
  const [athlete, setAthlete] = useState<AthleteDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAthlete = async () => {
      if (!athleteId) return

      try {
        setIsLoading(true)
        setError('')
        const data = await getAthleteDetail(athleteId)
        if (!data) {
          setError('No se encontró el atleta.')
          return
        }
        setAthlete(data)
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'No se pudo cargar la información del atleta.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchAthlete()
  }, [athleteId])

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return LABEL_NO_DATA
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return LABEL_NO_DATA
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center" edges={['top']}>
        <ActivityIndicator color="#22C55E" size="large" />
      </SafeAreaView>
    )
  }

  if (error || !athlete) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900" edges={['top']}>
        <View className="px-6 pt-4">
          <Pressable
            onPress={() => router.back()}
            className="p-2 -ml-2 active:opacity-70"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#64748B" />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text
            style={{
              fontFamily: 'Barlow_400Regular',
              fontSize: 15,
              color: '#EF4444',
              textAlign: 'center',
            }}
          >
            {error || 'No se encontró el atleta.'}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const ap = athlete.athlete_profiles

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con back */}
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
              fontFamily: 'Barlow_600SemiBold',
              fontSize: 16,
              color: '#94A3B8',
            }}
          >
            Detalle
          </Text>
        </View>

        {/* Avatar + Nombre */}
        <View className="items-center pt-6 pb-8">
          <View className="w-20 h-20 rounded-full bg-green-500/10 items-center justify-center mb-4">
            <Text
              style={{
                fontFamily: 'BebasNeue_400Regular',
                fontSize: 32,
                color: '#22C55E',
              }}
            >
              {athlete.full_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'BebasNeue_400Regular',
              fontSize: 30,
              color: '#F8FAFC',
              letterSpacing: 1,
              textAlign: 'center',
            }}
          >
            {athlete.full_name}
          </Text>
          <Text
            style={{
              fontFamily: 'Barlow_400Regular',
              fontSize: 14,
              color: '#64748B',
              marginTop: 4,
            }}
          >
            {athlete.email}
          </Text>
        </View>

        {/* Datos físicos */}
        <View className="px-6 gap-3 pb-8">
          <DataRow
            icon="barbell-outline"
            label={LABEL_WEIGHT}
            value={ap?.weight_kg ? `${ap.weight_kg} ${UNIT_KG}` : LABEL_NO_DATA}
          />
          <DataRow
            icon="resize-outline"
            label={LABEL_HEIGHT}
            value={ap?.height_cm ? `${ap.height_cm} ${UNIT_CM}` : LABEL_NO_DATA}
          />
          <DataRow
            icon="calendar-outline"
            label={LABEL_BIRTHDATE}
            value={formatDate(ap?.birth_date)}
          />
        </View>

        {/* Acciones placeholder */}
        <View className="px-6 gap-3 pb-10">
          <Pressable
            onPress={() => {
              /* Fase 3 */
            }}
            className="bg-slate-800 rounded-2xl p-4 flex-row items-center gap-3 active:opacity-80"
          >
            <Ionicons name="calendar" size={20} color="#2563EB" />
            <Text
              style={{
                fontFamily: 'Barlow_600SemiBold',
                fontSize: 15,
                color: '#94A3B8',
              }}
            >
              {BTN_CALENDAR}
            </Text>
            <View className="flex-1" />
            <Text
              style={{
                fontFamily: 'Barlow_400Regular',
                fontSize: 12,
                color: '#475569',
              }}
            >
              Próximamente
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              /* Fase futura */
            }}
            className="bg-slate-800 rounded-2xl p-4 flex-row items-center gap-3 active:opacity-80"
          >
            <Ionicons name="document-text-outline" size={20} color="#F97316" />
            <Text
              style={{
                fontFamily: 'Barlow_600SemiBold',
                fontSize: 15,
                color: '#94A3B8',
              }}
            >
              {BTN_NOTES}
            </Text>
            <View className="flex-1" />
            <Text
              style={{
                fontFamily: 'Barlow_400Regular',
                fontSize: 12,
                color: '#475569',
              }}
            >
              Próximamente
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const DataRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  value: string
}) => (
  <View className="bg-slate-800 rounded-2xl p-4 flex-row items-center gap-3">
    <Ionicons name={icon} size={18} color="#475569" />
    <Text
      style={{
        fontFamily: 'Barlow_400Regular',
        fontSize: 14,
        color: '#64748B',
      }}
    >
      {label}
    </Text>
    <View className="flex-1" />
    <Text
      style={{
        fontFamily: 'Barlow_600SemiBold',
        fontSize: 14,
        color: value === 'Sin registrar' ? '#475569' : '#F8FAFC',
      }}
    >
      {value}
    </Text>
  </View>
)

export default AthleteDetailScreen
