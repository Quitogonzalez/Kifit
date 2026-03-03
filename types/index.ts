export type UserRole = 'coach' | 'athlete'
export type TeamType = 'individual' | 'gym'
export type TeamMemberRole = 'owner' | 'coach'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  created_at: string
}

export interface Team {
  id: string
  name: string
  type: TeamType
  owner_id: string
  invite_code: string
  created_at: string
}

export interface TeamMember {
  team_id: string
  profile_id: string
  role: TeamMemberRole
  joined_at: string
}

export interface TeamAthlete {
  team_id: string
  athlete_id: string
  joined_at: string
}

export interface AthleteProfile {
  id: string
  weight_kg?: number
  height_cm?: number
  birth_date?: string
  updated_at: string
}

export interface AthleteWithProfile {
  athlete_id: string
  joined_at: string
  profiles: Pick<Profile, 'id' | 'full_name' | 'email' | 'avatar_url'>
}

export interface AthleteDetail {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  athlete_profiles: AthleteProfile | null
}

export interface InviteResult {
  success?: boolean
  error?: string
  athlete?: Pick<Profile, 'id' | 'full_name' | 'email'>
}

export interface AuthState {
  user: Profile | null
  teamId: string | null
  inviteCode: string | null
  isLoading: boolean
  isAuthenticated: boolean
}
