/// Minimal Database typing for Gooday (expand via `supabase gen types` later)
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          handle: string
          avatar_url: string | null
          cover_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          is_verified: boolean
          is_private: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          handle: string
          avatar_url?: string | null
          cover_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          is_verified?: boolean
          is_private?: boolean
          is_admin?: boolean
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      posts: {
        Row: {
          id: string
          author_id: string
          body: string
          audience: 'PUBLIC' | 'FOLLOWERS' | 'GROUP'
          location_name: string | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          author_id: string
          body?: string
          audience?: 'PUBLIC' | 'FOLLOWERS' | 'GROUP'
          location_name?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      groups: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          cover_url: string | null
          avatar_url: string | null
          privacy: 'PUBLIC' | 'PRIVATE'
          parent_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          cover_url?: string | null
          avatar_url?: string | null
          privacy?: 'PUBLIC' | 'PRIVATE'
          parent_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['groups']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: {
      get_feed: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          id: string
          author_id: string
          author_name: string
          author_handle: string
          author_avatar: string
          body: string
          created_at: string
          likes_count: number
          comments_count: number
          image_url: string
        }[]
      }
      toggle_follow: { Args: { p_following_id: string }; Returns: Json }
      toggle_like_post: { Args: { p_post_id: string }; Returns: Json }
      toggle_bookmark: { Args: { p_post_id: string }; Returns: Json }
      toggle_reaction: { Args: { p_post_id: string; p_emoji: string }; Returns: Json }
      join_group: { Args: { p_group_id: string }; Returns: Json }
      mark_notifications_read: { Args: { p_ids?: string[] }; Returns: number }
    }
    Enums: {
      privacy: 'PUBLIC' | 'PRIVATE'
      post_audience: 'PUBLIC' | 'FOLLOWERS' | 'GROUP'
      story_status: 'ACTIVE' | 'EXPIRED' | 'DELETED'
      media_type: 'IMAGE' | 'VIDEO'
    }
  }
}
