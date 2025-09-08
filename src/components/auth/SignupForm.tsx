import { useState, FormEvent, ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { useAuth } from '../../context/AuthContext'

interface SignupFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function SignupForm({ onSuccess, onError }: SignupFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    year: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signUp(form.name, form.email, form.password, form.branch, form.year)
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
        name="name" 
        placeholder="Name" 
        onChange={handleChange} 
        required 
        className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
        disabled={isLoading}
      />
      <input 
        name="email" 
        type="email" 
        placeholder="College Email" 
        onChange={handleChange} 
        required 
        className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
        disabled={isLoading}
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        onChange={handleChange} 
        required 
        className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
        disabled={isLoading}
      />
      <input 
        name="branch" 
        placeholder="Branch" 
        onChange={handleChange} 
        required 
        className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
        disabled={isLoading}
      />
      <input 
        name="year" 
        type="number" 
        placeholder="Year" 
        onChange={handleChange} 
        required 
        className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
        disabled={isLoading}
        min="1"
        max="4"
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </Button>
    </form>
  )
}
