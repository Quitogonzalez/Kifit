import { supabase } from '@/lib/supabase'
import type { AthleteWithProfile, AthleteDetail, InviteResult } from '@/types'

const INVITE_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const INVITE_CODE_LENGTH = 6

export const generateInviteCode = (): string => {
  let code = ''
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_CHARS[Math.floor(Math.random() * INVITE_CODE_CHARS.length)]
  }
  return code
}

export const getCoachTeam = async (
  coachId: string
): Promise<{ teamId: string; inviteCode: string } | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id, teams(invite_code)')
    .eq('profile_id', coachId)
    .limit(1)
    .single()

  if (error || !data) return null

  const team = data.teams as unknown as { invite_code: string }
  return { teamId: data.team_id, inviteCode: team.invite_code }
}

export const getTeamAthletes = async (
  teamId: string
): Promise<AthleteWithProfile[]> => {
  const { data, error } = await supabase
    .from('team_athletes')
    .select(
      `
      athlete_id,
      joined_at,
      profiles:athlete_id (
        id,
        full_name,
        email,
        avatar_url
      )
    `
    )
    .eq('team_id', teamId)

  if (error) {
    throw new Error('No se pudieron cargar los atletas. Intenta de nuevo.')
  }
  return (data ?? []) as unknown as AthleteWithProfile[]
}

export const getAthleteDetail = async (
  athleteId: string
): Promise<AthleteDetail | null> => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .eq('id', athleteId)
    .single()

  if (profileError || !profile) return null

  const { data: athleteData } = await supabase
    .from('athlete_profiles')
    .select('*')
    .eq('id', athleteId)
    .single()

  return {
    ...profile,
    athlete_profiles: athleteData ?? null,
  } as AthleteDetail
}

export const inviteAthleteByEmail = async (
  teamId: string,
  email: string
): Promise<InviteResult> => {
  const { data, error } = await supabase.rpc('invite_athlete_by_email', {
    team_id_input: teamId,
    athlete_email: email.trim().toLowerCase(),
  })

  if (error) {
    throw new Error('No se pudo invitar al atleta. Intenta de nuevo.')
  }
  return data as InviteResult
}
