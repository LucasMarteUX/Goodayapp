import { supabase } from '@/lib/supabase'
import type { Group, Post, Story } from '@/lib/media'

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.max(0, Math.floor(diffMs / 60_000))
  if (minutes < 60) return `${minutes || 1} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h`
  const days = Math.floor(hours / 24)
  return `${days} d`
}

type FeedRow = {
  id: string
  author_id: string
  author_name: string
  author_handle: string
  author_avatar: string | null
  body: string
  created_at: string
  likes_count: number
  comments_count: number
  image_url: string | null
  tags: string[] | null
  reactions: { emoji: string; count: number }[] | null
}

export function mapFeedToPost(row: FeedRow): Post {
  return {
    author: row.author_handle,
    avatar: row.author_avatar || '/assets/eec11.png',
    time: formatRelativeTime(row.created_at),
    text: row.body,
    tags: row.tags ?? [],
    image: row.image_url || '/assets/40f99.png',
    reactions: (row.reactions ?? []).map((r) => ({
      emoji: r.emoji,
      count: Number(r.count),
    })),
    likes: Number(row.likes_count),
    comments: Number(row.comments_count),
  }
}

export async function fetchHomeFeed(limit = 20): Promise<Post[]> {
  const { data, error } = await supabase.rpc('get_home_feed', {
    p_limit: limit,
    p_offset: 0,
  })
  if (error) throw error
  return ((data as FeedRow[]) ?? []).map(mapFeedToPost)
}

type GroupRow = {
  id: string
  name: string
  slug: string
  description: string | null
  cover_url: string | null
  privacy: 'PUBLIC' | 'PRIVATE'
  members_count: number
  posts_count: number
  member_avatars: string[] | null
}

export function mapGroupRow(row: GroupRow): Group {
  const members = Number(row.members_count)
  return {
    id: row.slug,
    name: row.name,
    cover: row.cover_url || '/assets/40f99.png',
    groups: Math.max(1, Math.floor(members / 35) || Number(row.posts_count) || 1),
    members: `${members.toLocaleString('pt-BR')} membros`,
    members_avatars: (row.member_avatars ?? []).filter(Boolean).slice(0, 3),
  }
}

export async function fetchGroups(): Promise<GroupRow[]> {
  const { data, error } = await supabase.rpc('get_groups_feed')
  if (error) throw error
  return (data as GroupRow[]) ?? []
}

export async function fetchGroupsForCards(): Promise<Group[]> {
  return (await fetchGroups()).map(mapGroupRow)
}

type StoryRow = {
  id: string
  author_id: string
  author_name: string
  author_handle: string
  author_avatar: string | null
  cover_url: string | null
  created_at: string
  expires_at: string
  seen: boolean
}

export async function fetchStories(viewer?: {
  name: string
  avatar: string
}): Promise<Story[]> {
  const { data, error } = await supabase.rpc('get_active_stories')
  if (error) throw error
  const rows = (data as StoryRow[]) ?? []

  const mapped: Story[] = rows.map((s) => ({
    name: s.author_handle.replace(/^@/, ''),
    avatar: s.author_avatar || '/assets/eec11.png',
    cover: s.cover_url || '/assets/40f99.png',
    seen: Boolean(s.seen),
  }))

  if (viewer) {
    return [
      {
        name: 'Você',
        avatar: viewer.avatar,
        cover: mapped[0]?.cover || '/assets/40f99.png',
        seen: false,
      },
      ...mapped.filter((s) => s.name !== viewer.name && !s.name.includes(viewer.name)),
    ]
  }
  return mapped
}

export type ProfileView = {
  id: string
  name: string
  handle: string
  avatar: string
  cover: string
  location: string
  bio: string
  interests: string[]
  followers: number
  following: number
  posts: string[]
  is_admin?: boolean
}

export async function fetchProfileByKey(personKey: string): Promise<ProfileView | null> {
  const slug = personKey.replace(/^@/, '')
  const handle = `@${slug}`

  let user:
    | {
        id: string
        name: string
        handle: string
        avatar_url: string | null
        cover_url: string | null
        bio: string | null
        location: string | null
        is_admin: boolean | null
      }
    | null = null

  const byHandle = await supabase
    .from('users')
    .select('id, name, handle, avatar_url, cover_url, bio, location, is_admin')
    .eq('handle', handle)
    .maybeSingle()

  if (byHandle.data) {
    user = byHandle.data
  } else {
    const byPartial = await supabase
      .from('users')
      .select('id, name, handle, avatar_url, cover_url, bio, location, is_admin')
      .ilike('handle', `%${slug}%`)
      .limit(1)
      .maybeSingle()
    user = byPartial.data
  }

  if (!user) return null

  const [{ count: followers }, { count: following }, postsRes, interestsRes] =
    await Promise.all([
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id),
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id),
      supabase
        .from('posts')
        .select('id')
        .eq('author_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase
        .from('user_interests')
        .select('interest_id, interests(name)')
        .eq('user_id', user.id),
    ])

  const postIds = (postsRes.data ?? []).map((p) => p.id)
  let postImages: string[] = []
  if (postIds.length > 0) {
    const { data: mediaRows } = await supabase
      .from('post_media')
      .select('post_id, order, media(url)')
      .in('post_id', postIds)
      .order('order', { ascending: true })

    const firstByPost = new Map<string, string>()
    for (const row of mediaRows ?? []) {
      const url = (row as { media?: { url?: string } | null }).media?.url
      if (url && !firstByPost.has(row.post_id)) firstByPost.set(row.post_id, url)
    }
    postImages = postIds.map((id) => firstByPost.get(id)).filter((u): u is string => Boolean(u))
  }

  const interests = (interestsRes.data ?? [])
    .map((row) => (row as { interests?: { name?: string } | null }).interests?.name)
    .filter((n): n is string => Boolean(n))

  return {
    id: user.handle.replace(/^@/, ''),
    name: user.name,
    handle: user.handle,
    avatar: user.avatar_url || '/assets/eec11.png',
    cover: user.cover_url || '/assets/40f99.png',
    location: user.location || '',
    bio: user.bio || '',
    interests,
    followers: followers ?? 0,
    following: following ?? 0,
    posts: postImages,
    is_admin: Boolean(user.is_admin),
  }
}

export type GrupoListItem = {
  id: string
  name: string
  description: string
  cover: string
  members: number
  posts: number
  status: 'Público' | 'Privado' | 'Participando'
  memberAvatars: string[]
}

export async function fetchGruposList(currentUserId?: string): Promise<GrupoListItem[]> {
  const rows = await fetchGroups()
  let myGroupIds = new Set<string>()

  if (currentUserId) {
    const { data } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', currentUserId)
      .eq('status', 'ACTIVE')
    myGroupIds = new Set((data ?? []).map((r) => r.group_id))
  }

  return rows.map((g) => ({
    id: g.slug,
    name: g.name,
    description: g.description || '',
    cover: g.cover_url || '/assets/40f99.png',
    members: Number(g.members_count),
    posts: Number(g.posts_count),
    status: myGroupIds.has(g.id)
      ? 'Participando'
      : g.privacy === 'PRIVATE'
        ? 'Privado'
        : 'Público',
    memberAvatars: (g.member_avatars ?? []).filter(Boolean),
  }))
}

export type GroupDetail = {
  id: string
  name: string
  cover: string
  privacy: string
  subgroups: number
  members: number
  postsCount: number
  description: string
  category: string
  memberAvatars: string[]
  posts: {
    id: string
    avatar: string
    name: string
    handle: string
    time: string
    text: string
    image?: string
    likes: number
    comments: number
  }[]
}

export async function fetchGroupDetail(slugOrId: string): Promise<GroupDetail | null> {
  const { data: group, error } = await supabase
    .from('groups')
    .select('id, name, slug, description, cover_url, privacy')
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .maybeSingle()

  if (error) throw error
  if (!group) return null

  const [{ count: members }, { data: avatars }, { data: groupPosts }] = await Promise.all([
    supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group.id)
      .eq('status', 'ACTIVE'),
    supabase
      .from('group_members')
      .select('user:users(avatar_url)')
      .eq('group_id', group.id)
      .eq('status', 'ACTIVE')
      .limit(4),
    supabase
      .from('group_posts')
      .select(
        `
        post:posts(
          id, body, created_at, author_id,
          author:users(name, handle, avatar_url),
          post_media(order, media(url))
        )
      `,
      )
      .eq('group_id', group.id)
      .limit(20),
  ])

  const posts = []
  for (const row of groupPosts ?? []) {
    const raw = row as unknown as { post?: Record<string, unknown> | Record<string, unknown>[] | null }
    const post = Array.isArray(raw.post) ? raw.post[0] : raw.post
    if (!post) continue
    const authorRaw = post.author as
      | { name?: string; handle?: string; avatar_url?: string }
      | { name?: string; handle?: string; avatar_url?: string }[]
      | null
    const author = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw
    const mediasRaw = post.post_media as
      | { order: number; media?: { url: string } | { url: string }[] | null }[]
      | null
    const medias = (mediasRaw ?? []).map((m) => ({
      order: m.order,
      url: Array.isArray(m.media) ? m.media[0]?.url : m.media?.url,
    }))
    const image = [...medias].sort((a, b) => a.order - b.order)[0]?.url

    const [{ count: likes }, { count: comments }] = await Promise.all([
      supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id as string),
      supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id as string)
        .is('deleted_at', null),
    ])

    posts.push({
      id: post.id as string,
      avatar: author?.avatar_url || '/assets/eec11.png',
      name: author?.name || 'Usuário',
      handle: author?.handle || '@user',
      time: formatRelativeTime(post.created_at as string),
      text: post.body as string,
      image: image || undefined,
      likes: likes ?? 0,
      comments: comments ?? 0,
    })
  }

  return {
    id: group.slug,
    name: group.name,
    cover: group.cover_url || '/assets/40f99.png',
    privacy: group.privacy === 'PRIVATE' ? 'Privado' : 'Público',
    subgroups: Math.max(1, Math.floor((members ?? 0) / 35)),
    members: members ?? 0,
    postsCount: posts.length,
    description: group.description || '',
    category: 'Comunidade',
    memberAvatars: (avatars ?? [])
      .map((a) => (a as { user?: { avatar_url?: string } | null }).user?.avatar_url)
      .filter((u): u is string => Boolean(u)),
    posts,
  }
}
