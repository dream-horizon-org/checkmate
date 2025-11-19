import {useSubmit} from '@remix-run/react'
import {APP_NAME} from '~/constants'
import {GoogleAuthButton} from '~/screens/Login/GoogleAuthButton'
import {AuthenticatorRoutes} from '~/services/auth/interfaces'

export const Login = () => {
  const submit = useSubmit()
  const login = () => {
    submit(null, {
      method: 'POST',
      action: AuthenticatorRoutes.LOGIN,
    })
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Left Side - Checkmate Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-center items-center">
        <div className="max-w-2xl px-12 w-full">
          <div className="mb-8 flex items-center gap-4">
            <img 
              src="/logo.svg" 
              alt={APP_NAME}
              className="h-16 w-auto"
            />
            <h1 className="text-5xl font-bold text-white tracking-tight">
              {APP_NAME}
            </h1>
          </div>
          
          <h2 className="text-2xl font-semibold text-slate-300 mb-4">
            Modern Test Case Management
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            Streamline your testing workflow with powerful features and seamless integrations. Organize, execute, and track your test cases with ease.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[#f2f5f9]">
        <div className="w-full max-w-md px-6 sm:px-8">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center flex flex-col items-center gap-3">
            <img 
              src="/logo.svg" 
              alt={APP_NAME}
              className="h-12 w-auto"
            />
            <h1 className="text-3xl font-bold text-slate-900">{APP_NAME}</h1>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-600 text-sm">
                Sign in to continue to {APP_NAME}
              </p>
            </div>

            <GoogleAuthButton onClick={login} />

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                By signing in, you agree to our terms of service
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center space-x-4 text-sm">
            <a
              href="https://checkmate.dreamsportslabs.com"
              className="text-slate-600 hover:text-slate-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <span className="text-slate-400">•</span>
            <a
              href="https://discord.gg/wBQXeYAKNc"
              className="text-slate-600 hover:text-slate-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
