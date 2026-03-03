import { create } from 'zustand'
import * as WebBrowser from 'expo-web-browser'
import * as AppleAuthentication from 'expo-apple-authentication'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/lib/auth'
import { getCoachTeam, generateInviteCode } from '@/lib/teams'
import type { Profile, UserRole } from '@/types'

WebBrowser.maybeCompleteAuthSession()

const REDIRECT_URI = makeRedirectUri({ scheme: 'kifit', path: 'auth/callback' })

interface AuthStore {
  user: Profile | null
  teamId: string | null
  inviteCode: string | null
  isLoading: boolean
  isAuthenticated: boolean
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
}

const loadCoachTeam = async (profileId: string) => {
  const teamInfo = await getCoachTeam(profileId)
  return {
    teamId: teamInfo?.teamId ?? null,
    inviteCode: teamInfo?.inviteCode ?? null,
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  teamId: null,
  inviteCode: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      set({ isLoading: true })
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) throw error

      if (session?.user) {
        const profile = await getProfile(session.user.id)
        if (profile) {
          const teamData =
            profile.role === 'coach' ? await loadCoachTeam(profile.id) : { teamId: null, inviteCode: null }
          set({ user: profile, isAuthenticated: true, ...teamData })
        } else {
          set({ user: null, isAuthenticated: false })
        }
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error)
        throw new Error(
          'Correo o contraseña incorrectos. Intenta de nuevo.'
        )

      if (data.session?.user) {
        const profile = await getProfile(data.session.user.id)
        if (profile) {
          const teamData =
            profile.role === 'coach' ? await loadCoachTeam(profile.id) : { teamId: null, inviteCode: null }
          set({ user: profile, isAuthenticated: true, ...teamData })
        }
      }
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    // #region agent log
    fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'useAuthStore.ts:signUp:entry',message:'signUp called',data:{email:email?.slice(0,3)+'…',role},hypothesisId:'H2',timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signUp({ email, password })

      // #region agent log
      fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'useAuthStore.ts:after signUp',message:'auth.signUp result',data:{hasError:!!error,errorMessage:error?.message,hasUser:!!data?.user,hasSession:!!data?.session},hypothesisId:'H1',timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (error)
        throw new Error('No se pudo crear la cuenta. Intenta de nuevo.')
      if (!data.user)
        throw new Error('No se pudo crear la cuenta. Intenta de nuevo.')

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
        })

      // #region agent log
      fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'useAuthStore.ts:after profile insert',message:'profile insert',data:{profileError:profileError?.message ?? null},hypothesisId:'H2',timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (profileError)
        throw new Error(
          'Cuenta creada, pero hubo un error al guardar el perfil.'
        )

      let teamId: string | null = null
      let inviteCode: string | null = null

      if (role === 'coach') {
        const code = generateInviteCode()
        const { data: rpcResult, error: teamError } = await supabase.rpc(
          'setup_coach_team',
          {
            coach_id: data.user.id,
            team_name: `Equipo de ${fullName}`,
            team_invite_code: code,
          }
        )

        // #region agent log
        fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'useAuthStore.ts:after setup_coach_team',message:'RPC result',data:{teamError:teamError?.message ?? null,hasRpcResult:!!rpcResult},hypothesisId:'H4',timestamp:Date.now()})}).catch(()=>{});
        // #endregion

        if (teamError) {
          throw new Error(
            'Cuenta creada, pero hubo un error al crear tu equipo. Cierra sesión e intenta entrar de nuevo.'
          )
        }

        teamId = rpcResult as string
        inviteCode = code
      }

      // #region agent log
      fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'useAuthStore.ts:before session check',message:'session check',data:{hasSession:!!data?.session},hypothesisId:'H1',timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (data.session) {
        const profile = await getProfile(data.user.id)

        // #region agent log
        fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'useAuthStore.ts:after getProfile',message:'getProfile result',data:{hasProfile:!!profile,profileId:profile?.id},hypothesisId:'H3',timestamp:Date.now()})}).catch(()=>{});
        // #endregion

        set({
          user: profile,
          isAuthenticated: !!profile,
          teamId,
          inviteCode,
        })
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'useAuthStore.ts:no session branch',message:'data.session is null, not setting user',data:{},hypothesisId:'H1',timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      }
    } catch (e) {
      // #region agent log
      fetch('http://127.0.0.1:7326/ingest/ad932a8b-cdfa-48a6-ac04-6dc4dfec33c1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c69d55'},body:JSON.stringify({sessionId:'c69d55',location:'useAuthStore.ts:signUp catch',message:'signUp error',data:{message:e instanceof Error?e.message:String(e)},hypothesisId:'H2',timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      throw e
    } finally {
      set({ isLoading: false })
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: REDIRECT_URI,
          skipBrowserRedirect: true,
        },
      })

      if (error || !data.url)
        throw new Error('No se pudo iniciar sesión con Google.')

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        REDIRECT_URI
      )

      if (result.type === 'success') {
        await get().initialize()
      }
    } finally {
      set({ isLoading: false })
    }
  },

  signInWithApple: async () => {
    try {
      set({ isLoading: true })
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (!credential.identityToken)
        throw new Error('No se pudo obtener el token de Apple.')

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      })

      if (error)
        throw new Error('No se pudo iniciar sesión con Apple.')

      if (data.session?.user) {
        let profile = await getProfile(data.session.user.id)

        if (!profile) {
          const fullName = [
            credential.fullName?.givenName,
            credential.fullName?.familyName,
          ]
            .filter(Boolean)
            .join(' ')

          await supabase.from('profiles').insert({
            id: data.session.user.id,
            email: data.session.user.email ?? '',
            full_name: fullName || 'Usuario',
            role: 'athlete' as UserRole,
          })
          profile = await getProfile(data.session.user.id)
        }

        if (profile) {
          const teamData =
            profile.role === 'coach'
              ? await loadCoachTeam(profile.id)
              : { teamId: null, inviteCode: null }
          set({ user: profile, isAuthenticated: true, ...teamData })
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('ERR_CANCELED')) {
        return
      }
      throw e
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true })
      const { error } = await supabase.auth.signOut()
      if (error)
        throw new Error(
          'No se pudo cerrar la sesión. Intenta de nuevo.'
        )
      set({
        user: null,
        isAuthenticated: false,
        teamId: null,
        inviteCode: null,
      })
    } finally {
      set({ isLoading: false })
    }
  },
}))
