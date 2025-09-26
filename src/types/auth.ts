export interface User {
  id: string
  email: string
  name?: string
  branch?: string
  semester?: string
  created_at?: string
  email_confirmed?: boolean
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  name: string
  branch: string
  semester: string
}

export interface ResetPasswordData {
  email: string
}