import { ActivityIndicator, Pressable, Text } from 'react-native'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  isLoading?: boolean
  disabled?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-blue',
  secondary: 'bg-slate-700',
  danger: 'bg-brand-red',
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
}: ButtonProps) => {
  const isDisabled = disabled || isLoading

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${variantClasses[variant]}
        h-14 rounded-xl items-center justify-center
        ${isDisabled ? 'opacity-50' : 'active:opacity-80'}
      `}
    >
      {isLoading ? (
        <ActivityIndicator color="#F8FAFC" />
      ) : (
        <Text className="text-slate-50 font-semibold text-base">
          {title}
        </Text>
      )}
    </Pressable>
  )
}

export default Button
