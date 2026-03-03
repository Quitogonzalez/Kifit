import { Text, View } from 'react-native'

const AthleteHomeScreen = () => {
  return (
    <View className="flex-1 bg-slate-900 items-center justify-center px-6">
      <Text className="text-brand-green text-2xl font-bold mb-2">KIFIT</Text>
      <Text className="text-slate-50 text-lg font-semibold mb-1">
        Panel de Atleta
      </Text>
      <Text className="text-slate-400 text-base text-center">
        Fase 5 — Próximamente
      </Text>
    </View>
  )
}

export default AthleteHomeScreen
