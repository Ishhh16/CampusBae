import { useState } from 'react'
import { Button } from '../ui/button'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Mail } from 'lucide-react'

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

export function ForgotPasswordForm({ onBack, onSuccess, onError }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      onError('📧 Please enter your email address');
      return;
    }

    setIsLoading(true)
    try {
      await resetPassword(email.trim())
      onSuccess('🎉 Password reset link has been sent to your email! Please check your inbox and follow the instructions to reset your password.')
    } catch (err: any) {
      // Handle specific 504 timeout errors
      if (err.message.includes('504') || err.message.includes('timeout') || err.message.includes('temporarily unavailable')) {
        onError('⏰ Email service is experiencing delays. Please contact support via WhatsApp or Instagram (links in footer) for immediate password reset assistance.')
      } else {
        onError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10">
          <Mail size={32} className="text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
        <p className="text-gray-400">
          No worries! Enter your IGDTUW email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="email" 
            placeholder="Enter your IGDTUW email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-3 rounded-lg text-white bg-white/10 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending Reset Link...
            </div>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </div>
    </div>
  )
}