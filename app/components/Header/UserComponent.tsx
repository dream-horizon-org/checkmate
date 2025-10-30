import {LogOut} from 'lucide-react'
import Profile from '~/assets/profile-default.png'
import {Avatar, AvatarImage} from '~/ui/avatar'

import {User} from '@dao/users.dao'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useSubmit} from '@remix-run/react'
import {AuthenticatorRoutes} from '@services/auth/interfaces'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu'

export const UserComponent = (user: User) => {
  const submit = useSubmit()
  const navigate = useCustomNavigate()

  const logout = () => {
    submit(null, {
      method: 'POST',
      action: AuthenticatorRoutes.LOGOUT,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-white">
              {user?.userName}
            </span>
            <span className="text-xs text-slate-400 capitalize">
              {user?.role}
            </span>
          </div>
          <Avatar className="h-9 w-9 cursor-pointer border-2 border-slate-700">
            {user?.profileUrl ? (
              <AvatarImage src={user.profileUrl} alt={user.userName} />
            ) : (
              <img
                className="flex items-center space-x-4 cursor-pointer"
                style={{width: 'auto'}}
                src={Profile}
                alt="User Profile"
              />
            )}
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuItem 
          onClick={(e) => {
            navigate('/userDetails', {}, e)
          }}
          className="cursor-pointer">
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut size={16} className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
