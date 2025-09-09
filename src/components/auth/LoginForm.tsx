import { useState } from 'react'
import { Button } from '../ui/button'
import { useAuth } from '../../context/AuthContext'

interface LoginFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  hasError?: boolean;
}

export function LoginForm({ onSuccess, onError, hasError }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn(email, password)
      onSuccess()
    } catch (err: any) {
      onError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input 
        type="email" 
        placeholder="College Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        className={`w-full p-2 rounded text-white transition-colors ${
          hasError 
            ? 'bg-red-500/10 border-red-500/50 focus:border-red-400' 
            : 'bg-white/10 border-white/20 focus:border-blue-400'
        }`}
        disabled={isLoading}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
        className={`w-full p-2 rounded text-white transition-colors ${
          hasError 
            ? 'bg-red-500/10 border-red-500/50 focus:border-red-400' 
            : 'bg-white/10 border-white/20 focus:border-blue-400'
        }`}
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
