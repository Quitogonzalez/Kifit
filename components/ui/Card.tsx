import { View } from 'react-native'

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <View className={`bg-slate-800 rounded-2xl p-4 ${className}`}>
      {children}
    </View>
  )
}

export default Card
