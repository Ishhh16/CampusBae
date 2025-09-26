import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

interface PasswordResetPageProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PasswordResetPage({ onSuccess, onError }: PasswordResetPageProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (password.length < 6) {
      onError('🔒 Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      onError('🔒 Passwords do not match');
      return;
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      
      if (error) {
        if (error.message.includes('New password should be different')) {
          onError('🔒 Please choose a different password from your current one');
        } else if (error.message.includes('Password should be')) {
          onError('🔒 Password is too weak. Please use a stronger password');
        } else {
          onError(`❌ Failed to reset password: ${error.message}`);
        }
        return;
      }
      
      setIsSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
      
    } catch (err: any) {
      onError(`❌ Password reset failed: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Password Reset Successful!</h2>
          <p className="text-gray-400 mb-6">
            Your password has been successfully updated. You can now login with your new password.
          </p>
          <p className="text-sm text-blue-400">
            Redirecting to login page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="space-y-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10">
            <Lock size={32} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Reset Your Password</h2>
          <p className="text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full p-3 pr-12 rounded-lg text-white bg-white/10 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-300"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Confirm Password */}
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              className="w-full p-3 pr-12 rounded-lg text-white bg-white/10 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-300"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Password Requirements */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>At least 6 characters long</li>
              <li>Should be different from your current password</li>
            </ul>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Updating Password...
              </div>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}