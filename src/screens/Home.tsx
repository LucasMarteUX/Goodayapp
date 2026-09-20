import { useEffect, useState } from 'react'
import {
  BottomNav,
  ContextRail,
  GroupCard,
  MobileHeader,
  PostCard,
  SidebarNav,
  StoriesRow,
  TopBar,
} from '../components/home'
import Notifications from '../components/Notifications'
import { useAuth } from '../lib/auth'
import {
  fetchGroupsForCards,
  fetchHomeFeed,
  fetchStories,
} from '../lib/api'
import type { Group, Post, Story } from '../lib/media'
import { currentUser as fallbackUser } from '../lib/media'

export default function Home({
  onNavigate,
  activeKey,
  onOpenGroup,
}: {
  onNavigate?: (key: string) => void
  activeKey?: string
  onOpenGroup?: (id: string) => void
}) {
  const { profile } = useAuth()
  const [showNotifs, setShowNotifs] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const user = {
    name: profile?.name ?? fallbackUser.name,
    handle: profile?.handle ?? fallbackUser.handle,
    avatar: profile?.avatar_url ?? fallbackUser.avatar,
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [feed, groupCards, storyList] = await Promise.all([
          fetchHomeFeed(30),
          fetchGroupsForCards(),
          fetchStories({ name: user.name, avatar: user.avatar }),
        ])
        if (cancelled) return
        setPosts(feed)
        setGroups(groupCards)
        setStories(storyList)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar o feed')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user.avatar, user.name])

  return (
    <div className="min-h-dvh w-full bg-canvas pb-28 min-[800px]:pb-0">
      <TopBar user={user} onNavigate={onNavigate} onNotifications={() => setShowNotifs(true)} />
      <MobileHeader user={user} onNotifications={() => setShowNotifs(true)} onNavigate={onNavigate} />
      {showNotifs && <Notifications onClose={() => setShowNotifs(false)} />}

      <div className="w-full px-5 min-[1800px]:px-8">
        <section className="py-4">
          <StoriesRow stories={stories} />
        </section>

        <section className="min-[800px]:hidden">
          <h2 className="mb-3 px-0.5 text-[16px] font-semibold text-ink">Grupos para você</h2>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {groups.map((g) => (
              <div key={g.id} className="w-[190px] shrink-0 sm:w-[220px]">
                <GroupCard group={g} onOpenGroup={onOpenGroup} />
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 py-5 min-[800px]:grid-cols-[max-content_minmax(280px,560px)_minmax(240px,1fr)] min-[1200px]:gap-10 min-[1800px]:gap-12">
          <aside className="hidden min-[800px]:block">
            <div className="sticky top-[68px]">
              <SidebarNav activeKey={activeKey} onNavigate={onNavigate} />
            </div>
          </aside>

          <main className="mx-auto w-full max-w-[640px] space-y-5 min-[800px]:mx-0 min-[800px]:max-w-none">
            {loading && (
              <p className="rounded-xl bg-surface px-4 py-6 text-center text-[14px] text-neutral-500">
                Carregando publicações…
              </p>
            )}
            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-600">{error}</p>
            )}
            {!loading && !error && posts.length === 0 && (
              <p className="rounded-xl bg-surface px-4 py-6 text-center text-[14px] text-neutral-500">
                Nenhuma publicação ainda.
              </p>
            )}
            {posts.map((p) => (
              <PostCard key={`${p.author}-${p.time}-${p.text.slice(0, 24)}`} post={p} />
            ))}
          </main>

          <aside className="hidden min-[800px]:block">
            <div
              className="sticky top-[68px] overflow-y-auto"
              style={{
                maxHeight: 'calc(100dvh - 68px)',
                maskImage:
                  'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 24px), transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 24px), transparent 100%)',
                scrollbarWidth: 'none',
              }}
            >
              <div className="py-6">
                <ContextRail groups={groups} onOpenGroup={onOpenGroup} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BottomNav activeKey={activeKey} onNavigate={onNavigate} />
    </div>
  )
}
