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
    <div className="flex overflow-hidden fixed inset-0">
      {/* Left Side - Checkmate Branding */}
      <div className="hidden flex-col justify-center items-center border-r lg:flex lg:w-1/2 bg-slate-900 border-slate-800">
        <div className="px-12 w-full max-w-2xl">
          <div className="flex gap-4 items-center mb-8">
            <img 
              src="/logo.svg" 
              alt={APP_NAME}
              className="w-auto h-16"
            />
            <h1 className="text-5xl font-bold tracking-tight text-white">
              {APP_NAME}
            </h1>
          </div>
          
          <h2 className="mb-4 text-2xl font-semibold text-slate-300">
            Modern Test Case Management
          </h2>
          
          <p className="max-w-xl text-lg leading-relaxed text-slate-400">
            Streamline your testing workflow with powerful features and seamless integrations. Organize, execute, and track your test cases with ease.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[#f2f5f9]">
        <div className="px-6 w-full max-w-md sm:px-8">
          {/* Mobile Logo */}
          <div className="flex flex-col gap-3 items-center mb-8 text-center lg:hidden">
            <img 
              src="/logo.svg" 
              alt={APP_NAME}
              className="w-auto h-12"
            />
            <h1 className="text-3xl font-bold text-slate-900">{APP_NAME}</h1>
          </div>

          <div className="p-8 bg-white rounded-lg border shadow-sm border-slate-200 sm:p-10">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-semibold text-slate-900">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-600">
                Sign in to continue to {APP_NAME}
              </p>
            </div>

            <GoogleAuthButton onClick={login} />

            <div className="pt-6 mt-6 border-t border-slate-200">
              <p className="text-xs text-center text-slate-500">
                By signing in, you agree to our terms of service
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 space-x-4 text-sm text-center">
            <a
              href="https://checkmate.dreamhorizon.org"
              className="transition-colors text-slate-600 hover:text-slate-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <span className="text-slate-400">•</span>
            <a
              href="https://discord.gg/wBQXeYAKNc"
              className="transition-colors text-slate-600 hover:text-slate-900"
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
