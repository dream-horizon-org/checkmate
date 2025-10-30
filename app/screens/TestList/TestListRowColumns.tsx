import {useSearchParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {cn} from '@ui/utils'
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronsUpDown,
} from 'lucide-react'
import {useEffect, useState} from 'react'
import {Tooltip} from '~/components/Tooltip/Tooltip'

export const HeaderComponent = ({
  heading,
  position = 'center',
  className,
}: {
  heading: string
  position?: 'center' | 'left' | 'right'
  className?: string
}) => {
  const positionClass = position === 'left' ? 'text-left' : position === 'right' ? 'text-right' : 'text-center'

  return (
    <div
      className={cn(
        'truncate',
        positionClass,
        className,
      )}>
      {heading}
    </div>
  )
}

export const TitleRowComponent = ({
  content,
  onClick,
  className,
  clickable = false,
  columnWidth,
  initialWidth,
}: {
  content: string
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  className?: string
  clickable?: boolean
  columnWidth: string
  initialWidth: string
}) => {
  const [maxWidth, setMaxWidth] = useState(initialWidth)

  useEffect(() => {
    const calculateMaxWidth = () => {
      const windowWidth = window.innerWidth
      const columnPercentage = columnWidth
        ? parseFloat(columnWidth) / 30
        : 15 / 30
      const calculatedWidth = Math.min(
        windowWidth * 0.65,
        windowWidth * columnPercentage,
      )

      setMaxWidth(`${calculatedWidth}px`)
    }

    calculateMaxWidth()
    window.addEventListener('resize', calculateMaxWidth)

    return () => {
      window.removeEventListener('resize', calculateMaxWidth)
    }
  }, [columnWidth])

  return (
    <Tooltip
      anchor={
        <div
          className={cn(
            'text-left truncate text-sm',
            clickable
              ? 'cursor-pointer hover:underline hover:text-slate-900 text-slate-700 font-medium'
              : 'hover:no-underline hover:text-current cursor-default text-slate-700',
            className,
          )}
          style={{
            width: maxWidth,
            maxWidth: 600,
          }}
          onClick={onClick}>
          {content}
        </div>
      }
      content={content}
    />
  )
}

export const SortIcon = ({
  heading,
  sortOrder,
  sortBy,
}: {
  heading: string
  sortOrder: string | null
  sortBy: string | null
}) => {
  if (!sortOrder || !sortBy || sortBy.toLowerCase() !== heading.toLowerCase())
    return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-400" />

  return sortOrder === 'asc' ? (
    <ArrowUpNarrowWide className="ml-1.5 h-3.5 w-3.5 text-slate-600" />
  ) : (
    <ArrowDownWideNarrow className="ml-1.5 h-3.5 w-3.5 text-slate-600" />
  )
}

export const SortingHeaderComponent = ({
  heading,
  className,
  position,
}: {
  heading: string
  className?: string
  position?: 'center' | 'left' | 'right'
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const sortBy = searchParams.get('sortBy')
  const sortOrder = searchParams.get('sortOrder')
  let removeSort = false

  if (sortOrder === 'dsc' && sortBy === heading.toLowerCase()) {
    removeSort = true
  }

  const positionClass = position === 'left' ? 'justify-start' : position === 'right' ? 'justify-end' : 'justify-center'

  return (
    <Button
      variant="ghost"
      className={cn(
        'truncate h-auto p-0 hover:bg-transparent',
        positionClass,
        className,
      )}
      onClick={() =>
        setSearchParams(
          (prev) => {
            !removeSort
              ? (prev.set('sortOrder', sortOrder === 'asc' ? 'dsc' : 'asc'),
                prev.set('sortBy', heading.toLowerCase()))
              : (prev.delete('sortOrder'), prev.delete('sortBy'))
            return prev
          },
          {replace: true},
        )
      }>
      {heading}
      <SortIcon
        heading={heading}
        sortOrder={searchParams.get('sortOrder')}
        sortBy={searchParams.get('sortBy')}
      />
    </Button>
  )
}

export const PriorityRowComponent = ({priority}: {priority: string}) => {
  const textColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return '#dc2626'
      case 'High':
        return '#ea580c'
      case 'Medium':
        return '#ca8a04'
      case 'Low':
        return '#2563eb'
      default:
        return '#64748b'
    }
  }
  return (
    <span style={{color: textColor(priority)}} className="text-left text-sm font-medium">
      {priority}
    </span>
  )
}

export const PlatformComponent = ({
  content,
  className,
}: {
  content: string
  className?: string
}) => (
  <Tooltip
    anchor={
      <div className={cn('max-w-32 text-left truncate text-sm text-slate-700', className)}>
        {content}
      </div>
    }
    content={content}
  />
)
