import { Text } from 'react-native'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption'

interface TypographyProps {
  variant: TypographyVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<TypographyVariant, string> = {
  h1: 'text-3xl font-bold text-slate-50',
  h2: 'text-xl font-semibold text-slate-50',
  h3: 'text-lg font-semibold text-slate-50',
  body: 'text-base text-slate-50',
  caption: 'text-sm text-slate-400',
}

const Typography = ({ variant, children, className = '' }: TypographyProps) => {
  return (
    <Text className={`${variantClasses[variant]} ${className}`}>
      {children}
    </Text>
  )
}

export default Typography
