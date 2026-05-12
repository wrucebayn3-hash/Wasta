import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AvatarProps {
  name?: string | null
  image?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ name, image, size = 'md', className }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }

  if (image) {
    return (
      <img
        src={image}
        alt={name ?? 'User'}
        className={cn('rounded-full object-cover flex-shrink-0', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-[#17171c] text-white flex items-center justify-center font-medium flex-shrink-0',
        sizes[size],
        className
      )}
    >
      {name ? getInitials(name) : '?'}
    </div>
  )
}
