import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/stores/useAuthStore'
import { UserRole } from '@/types'

const TITLE = 'Crear cuenta'
const SUBTITLE = 'Completa tus datos para comenzar'
const LABEL_NAME = 'Nombre completo'
const PLACEHOLDER_NAME = 'Juan Pérez'
const LABEL_EMAIL = 'Correo electrónico'
const PLACEHOLDER_EMAIL = 'email@email.com'
const LABEL_PASSWORD = 'Contraseña'
const PLACEHOLDER_PASSWORD = '••••••••••'
const LABEL_CONFIRM = 'Confirmar contraseña'
const LABEL_ROLE = 'Soy...'
const BTN_REGISTER = 'Crear cuenta'
const LINK_LOGIN_PREFIX = '¿Ya tienes cuenta?  '
const LINK_LOGIN = 'Iniciar sesión'

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'coach', label: 'Coach', description: 'Diseño planes y guío atletas' },
  { value: 'athlete', label: 'Atleta', description: 'Sigo un plan de entrenamiento' },
]

const RegisterScreen = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  const { signUp, isLoading } = useAuthStore()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'athlete',
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    setError('')
    try {
      await signUp(data.email, data.password, data.fullName, data.role)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Ocurrió un error. Intenta de nuevo.')
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header compacto */}
          <View style={{ alignItems: 'center', paddingTop: 32, paddingBottom: 28 }}>
            {/* Botón volver */}
            <Pressable
              onPress={() => router.back()}
              style={{ position: 'absolute', top: 16, left: 20, padding: 8, zIndex: 10 }}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={22} color="#64748B" />
            </Pressable>
            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 20 }}>
              {[160, 120].map((size) => (
                <View
                  key={size}
                  style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 1,
                    borderColor: 'rgba(34, 197, 94, 0.07)',
                  }}
                />
              ))}
            </View>
            <Text
              style={{
                fontFamily: 'BebasNeue_400Regular',
                fontSize: 52,
                color: '#22C55E',
                letterSpacing: 5,
                textShadowColor: 'rgba(34, 197, 94, 0.3)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 20,
              }}
            >
              KIFIT
            </Text>
          </View>

          {/* Formulario */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#0F172A',
              borderTopWidth: 1,
              borderTopColor: 'rgba(51, 65, 85, 0.8)',
              paddingHorizontal: 28,
              paddingTop: 32,
              paddingBottom: 40,
            }}
          >
            <Text
              style={{
                fontFamily: 'BebasNeue_400Regular',
                fontSize: 36,
                color: '#F8FAFC',
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              {TITLE}
            </Text>
            <Text
              style={{
                fontFamily: 'Barlow_400Regular',
                fontSize: 14,
                color: '#64748B',
                marginBottom: 28,
              }}
            >
              {SUBTITLE}
            </Text>

            {/* Nombre completo */}
            <FieldLabel text={LABEL_NAME} />
            <Controller
              control={control}
              name="fullName"
              rules={{ required: 'El nombre es obligatorio.' }}
              render={({ field: { onChange, value } }) => (
                <FieldWrapper hasError={!!errors.fullName}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={PLACEHOLDER_NAME}
                    placeholderTextColor="#475569"
                    autoCapitalize="words"
                    style={fieldTextStyle}
                  />
                  <Ionicons name="person-outline" size={18} color="#475569" />
                </FieldWrapper>
              )}
            />
            {errors.fullName && <FieldError text={errors.fullName.message ?? ''} />}

            {/* Email */}
            <FieldLabel text={LABEL_EMAIL} />
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'El correo es obligatorio.',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido.' },
              }}
              render={({ field: { onChange, value } }) => (
                <FieldWrapper hasError={!!errors.email}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={PLACEHOLDER_EMAIL}
                    placeholderTextColor="#475569"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={fieldTextStyle}
                  />
                  <Ionicons name="mail-outline" size={18} color="#475569" />
                </FieldWrapper>
              )}
            />
            {errors.email && <FieldError text={errors.email.message ?? ''} />}

            {/* Contraseña */}
            <FieldLabel text={LABEL_PASSWORD} />
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'La contraseña es obligatoria.',
                minLength: { value: 8, message: 'Mínimo 8 caracteres.' },
              }}
              render={({ field: { onChange, value } }) => (
                <FieldWrapper hasError={!!errors.password}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={PLACEHOLDER_PASSWORD}
                    placeholderTextColor="#475569"
                    secureTextEntry={!showPassword}
                    style={fieldTextStyle}
                  />
                  <Pressable onPress={() => setShowPassword((v) => !v)}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#475569"
                    />
                  </Pressable>
                </FieldWrapper>
              )}
            />
            {errors.password && <FieldError text={errors.password.message ?? ''} />}

            {/* Confirmar contraseña */}
            <FieldLabel text={LABEL_CONFIRM} />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Confirma tu contraseña.',
                validate: (val) =>
                  val === watch('password') || 'Las contraseñas no coinciden.',
              }}
              render={({ field: { onChange, value } }) => (
                <FieldWrapper hasError={!!errors.confirmPassword}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={PLACEHOLDER_PASSWORD}
                    placeholderTextColor="#475569"
                    secureTextEntry={!showConfirm}
                    style={fieldTextStyle}
                  />
                  <Pressable onPress={() => setShowConfirm((v) => !v)}>
                    <Ionicons
                      name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#475569"
                    />
                  </Pressable>
                </FieldWrapper>
              )}
            />
            {errors.confirmPassword && <FieldError text={errors.confirmPassword.message ?? ''} />}

            {/* Selector de rol */}
            <FieldLabel text={LABEL_ROLE} />
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange } }) => (
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
                  {ROLES.map(({ value, label, description }) => {
                    const active = selectedRole === value
                    return (
                      <Pressable
                        key={value}
                        onPress={() => onChange(value)}
                        style={{
                          flex: 1,
                          paddingVertical: 14,
                          paddingHorizontal: 12,
                          borderRadius: 14,
                          borderWidth: 1.5,
                          borderColor: active ? '#22C55E' : '#334155',
                          backgroundColor: active ? 'rgba(34, 197, 94, 0.08)' : '#1E293B',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Barlow_700Bold',
                            fontSize: 14,
                            color: active ? '#22C55E' : '#94A3B8',
                            marginBottom: 3,
                          }}
                        >
                          {label}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Barlow_400Regular',
                            fontSize: 11,
                            color: active ? '#4ADE80' : '#475569',
                            textAlign: 'center',
                            lineHeight: 15,
                          }}
                        >
                          {description}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              )}
            />

            {/* Error general */}
            {error !== '' && (
              <Text
                style={{
                  fontFamily: 'Barlow_400Regular',
                  fontSize: 13,
                  color: '#EF4444',
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                {error}
              </Text>
            )}

            {/* Botón principal */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-green-500 h-14 rounded-2xl items-center justify-center mb-6 active:opacity-80"
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <Text
                style={{
                  fontFamily: 'Barlow_700Bold',
                  fontSize: 16,
                  color: '#0F172A',
                  letterSpacing: 0.5,
                }}
              >
                {BTN_REGISTER}
              </Text>
            </Pressable>

            {/* Ir al login */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text
                style={{ fontFamily: 'Barlow_400Regular', fontSize: 14, color: '#475569' }}
              >
                {LINK_LOGIN_PREFIX}
              </Text>
              <Pressable onPress={() => router.replace('/(auth)/login')}>
                <Text
                  style={{
                    fontFamily: 'Barlow_600SemiBold',
                    fontSize: 14,
                    color: '#22C55E',
                  }}
                >
                  {LINK_LOGIN}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const fieldTextStyle = {
  flex: 1,
  color: '#F8FAFC',
  fontFamily: 'Barlow_400Regular',
  fontSize: 15,
} as const

const FieldLabel = ({ text }: { text: string }) => (
  <Text
    style={{
      fontFamily: 'Barlow_600SemiBold',
      fontSize: 13,
      color: '#94A3B8',
      marginBottom: 8,
    }}
  >
    {text}
  </Text>
)

const FieldWrapper = ({
  children,
  hasError,
}: {
  children: React.ReactNode
  hasError: boolean
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1E293B',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hasError ? '#EF4444' : '#334155',
      paddingHorizontal: 16,
      height: 54,
      marginBottom: 6,
    }}
  >
    {children}
  </View>
)

const FieldError = ({ text }: { text: string }) => (
  <Text
    style={{
      fontFamily: 'Barlow_400Regular',
      fontSize: 12,
      color: '#EF4444',
      marginBottom: 14,
    }}
  >
    {text}
  </Text>
)

export default RegisterScreen
