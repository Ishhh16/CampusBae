import { useState, FormEvent, ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { useAuth } from '../../context/AuthContext'

interface SignupFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  hasError?: boolean;
}

export function SignupForm({ onSuccess, onError, hasError }: SignupFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    enrollmentNumber: '',
    branch: '',
    batch: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailValidationMessage, setEmailValidationMessage] = useState<string | null>(null)
  const { signUp } = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Real-time email validation
    if (name === 'email' && value.length > 0) {
      const error = validateEmail(value);
      setEmailValidationMessage(error);
    } else if (name === 'email') {
      setEmailValidationMessage(null);
    }
  }

  const validateEmail = (email: string): string | null => {
    // Check domain
    if (!email.endsWith('@igdtuw.ac.in')) {
      return '🏫 Please use your official IGDTUW college email address (@igdtuw.ac.in)';
    }

    // Check basic email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@igdtuw\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return '📞 Invalid email format. Please use a valid IGDTUW email address.';
    }

    // Check local part
    const localPart = email.split('@')[0];
    if (localPart.length < 3) {
      return '🏫 Please use your complete college email address.';
    }

    // Check for invalid patterns
    if (localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
      return '📞 Invalid email format. Please check your email address.';
    }

    return null; // No errors
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const emailError = validateEmail(form.email);
    if (emailError) {
      onError(emailError);
      return;
    }
    
    // Validate batch year
    const batchYear = parseInt(form.batch);
    if (batchYear < 2024 || batchYear > 2030) {
      onError('🎓 Please enter a valid batch year (2024-2030)');
      return;
    }
    
    setIsLoading(true)
    // Clear the inline validation message since we're proceeding
    setEmailValidationMessage(null);
    
    try {
      await signUp(form.name, form.email, form.password, form.enrollmentNumber, form.branch, form.batch)
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
        className={`w-full p-2 rounded text-white transition-colors ${
          hasError 
            ? 'bg-red-500/10 border-red-500/50 focus:border-red-400' 
            : 'bg-white/10 border-white/20 focus:border-blue-400'
        }`}
        disabled={isLoading}
      />
      <div className="relative">
        <input 
          name="email" 
          type="email" 
          placeholder="College Email" 
          onChange={handleChange} 
          required 
          className={`w-full p-2 rounded text-white transition-colors ${
            emailValidationMessage || hasError
              ? 'bg-red-500/10 border-red-500/50 focus:border-red-400' 
              : form.email && !emailValidationMessage
              ? 'bg-green-500/10 border-green-500/50 focus:border-green-400'
              : 'bg-white/10 border-white/20 focus:border-blue-400'
          }`}
          disabled={isLoading}
        />
        {emailValidationMessage && (
          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <span>⚠️</span>
            {emailValidationMessage}
          </p>
        )}
        {form.email && !emailValidationMessage && form.email.endsWith('@igdtuw.ac.in') && (
          <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
            <span>✓</span>
            Valid IGDTUW email format
          </p>
        )}
      </div>
      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        onChange={handleChange} 
        required 
        className={`w-full p-2 rounded text-white transition-colors ${
          hasError 
            ? 'bg-red-500/10 border-red-500/50 focus:border-red-400' 
            : 'bg-white/10 border-white/20 focus:border-blue-400'
        }`}
        disabled={isLoading}
      />
      <input 
        name="enrollmentNumber" 
        placeholder="Enrollment Number" 
        onChange={handleChange} 
        required 
        className={`w-full p-2 rounded text-white transition-colors ${
          hasError 
            ? 'bg-red-500/10 border-red-500/50 focus:border-red-400' 
            : 'bg-white/10 border-white/20 focus:border-blue-400'
        }`}
        disabled={isLoading}
      />
      <input 
        name="branch" 
        placeholder="Branch" 
        onChange={handleChange} 
        required 
        className={`w-full p-2 rounded text-white transition-colors ${
          hasError 
            ? 'bg-red-500/10 border-red-500/50 focus:border-red-400' 
            : 'bg-white/10 border-white/20 focus:border-blue-400'
        }`}
        disabled={isLoading}
      />
      <input 
        name="batch" 
        type="number" 
        placeholder="Batch of (e.g., 2028)" 
        onChange={handleChange} 
        required 
        className={`w-full p-2 rounded text-white transition-colors ${
          hasError 
            ? 'bg-red-500/10 border-red-500/50 focus:border-red-400' 
            : 'bg-white/10 border-white/20 focus:border-blue-400'
        }`}
        disabled={isLoading}
        min="2024"
        max="2030"
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
