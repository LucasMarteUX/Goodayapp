import type { SVGProps } from 'react'
import {
  House,
  Search,
  MessageCircle,
  Plus,
  CirclePlus,
  Users,
  User,
  Settings,
  Bell,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  FaceSlightlySmiling,
  Ellipsis,
  Moon,
  SlidersHorizontal,
  Network,
} from 'lucide-react'

export { House as HomeIcon }
export { Search as SearchIcon }
export { MessageCircle as MessageIcon }
export { Plus as PlusIcon }
export { CirclePlus as PlusCircleIcon }
export { Users as GroupsIcon }
export { User as ProfileIcon }
export { Settings as SettingsIcon }
export { Bell as BellIcon }
export { Heart as HeartIcon }
export { MessageSquare as CommentIcon }
export { Share2 as ShareIcon }
export { Bookmark as BookmarkIcon }
export { FaceSlightlySmiling as SmileIcon }
export { Ellipsis as MoreIcon }
export { Moon as MoonIcon }
export { SlidersHorizontal as FilterIcon }
export { Network as ConnectIcon }

export function InfinityMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 30" fill="none" {...props}>
      <path
        d="M17 4c-7 0-13 5-13 11s6 11 13 11c6 0 9-4 15-11 6-7 9-11 15-11 7 0 13 5 13 11s-6 11-13 11c-6 0-9-4-15-11C25 8 23 4 17 4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string; markClassName?: string }) {
  return (
    <img
      src="/assets/gooday-logo.svg"
      alt="Gooday"
      className={`select-none h-8 w-auto ${className}`}
    />
  )
}
