import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native'

interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  secureTextEntry?: boolean
  error?: string
  keyboardType?: KeyboardTypeOptions
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
}

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: InputProps) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-slate-400 text-sm mb-1">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#475569"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        className="bg-slate-800 border border-slate-700 rounded-xl px-4 h-14 text-slate-50 text-base"
      />
      {error && (
        <Text className="text-brand-red text-sm mt-1">{error}</Text>
      )}
    </View>
  )
}

export default Input
