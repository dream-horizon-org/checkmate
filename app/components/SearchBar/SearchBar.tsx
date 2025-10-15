import {ChangeEventHandler, useEffect, useRef, useState} from 'react'
import {CrossCircledIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons'
import {Input} from '~/ui/input'
import {cn} from '~/ui/utils'

type SearchBarProps = {
  handlechange: (value: string) => void
  placeholdertext?: string
  searchstring?: string
}

export const SearchBar = (props: SearchBarProps) => {
  const input = useRef<HTMLInputElement>(null)
  const [searchstring, setSearchString] = useState(props.searchstring ?? '')
  const [lastSearchString, setLastSearchString] = useState(
    props.searchstring ?? '',
  )

  const listener = (event: KeyboardEvent) => {
    if (event.code === 'Enter' && searchstring !== lastSearchString) {
      setLastSearchString(searchstring)
      props.handlechange(searchstring)
    }
  }

  const activateSearchListener = (event: KeyboardEvent) => {
    if (event.code === 'Slash' && input.current) {
      event.preventDefault()
      input.current.focus()
    }
  }

  useEffect(() => {
    document.addEventListener('keypress', activateSearchListener)

    return () =>
      document.removeEventListener('keypress', activateSearchListener)
  }, [])

  useEffect(() => {
    const searchBar = document.getElementById('search-bar')
    if (searchBar) searchBar.addEventListener('keypress', listener)

    return () => {
      searchBar?.removeEventListener('keypress', listener)
    }
  }, [searchstring, lastSearchString])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(() => e.target.value)
  }

  const resetSearch = () => {
    input.current ? (input.current.value = '') : ''
    lastSearchString !== '' && props.handlechange('')
    setSearchString('')
    setLastSearchString('')
  }

  return (
    <div
      className="flex items-center rounded-lg w-full relative"
      id={'search-bar'}>
      <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-slate-400 absolute left-3" />
      <Input
        type="text"
        ref={input}
        className={cn(
          'h-10 border-slate-200 bg-white rounded-lg shadow-sm hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 file:font-medium pl-10 pr-10 text-sm',
        )}
        placeholder={props.placeholdertext || 'Search...'}
        onChange={handleChange}
        value={searchstring}
      />
      {searchstring?.length > 0 && (
        <CrossCircledIcon
          className="absolute right-3 cursor-pointer size-4 text-slate-400 hover:text-slate-600 transition-colors"
          onClick={resetSearch}
        />
      )}
      {searchstring?.length === 0 && (
        <kbd className="absolute right-3 bg-slate-100 border border-slate-200 rounded text-xs px-2 py-0.5 text-slate-500 font-mono">
          /
        </kbd>
      )}
    </div>
  )
}
