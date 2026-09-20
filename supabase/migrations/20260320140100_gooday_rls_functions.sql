-- Gooday: helper functions + RLS + triggers + RPCs

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_posts_updated_at ON public.posts;
CREATE TRIGGER trg_posts_updated_at BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_groups_updated_at ON public.groups;
CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON public.groups
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_conversations_updated_at ON public.conversations;
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helpers
CREATE OR REPLACE FUNCTION public.is_group_member(p_group_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = p_group_id
      AND gm.user_id = p_user_id
      AND gm.status = 'ACTIVE'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_group_admin(p_group_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = p_group_id
      AND gm.user_id = p_user_id
      AND gm.status = 'ACTIVE'
      AND gm.role IN ('OWNER', 'ADMIN')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_conversation_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = p_conversation_id
      AND cp.user_id = p_user_id
      AND cp.left_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.can_view_post(p_post public.posts)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p_post.deleted_at IS NULL
    AND (
      p_post.audience = 'PUBLIC'
      OR p_post.author_id = auth.uid()
      OR (
        p_post.audience = 'FOLLOWERS'
        AND EXISTS (
          SELECT 1 FROM public.follows f
          WHERE f.following_id = p_post.author_id AND f.follower_id = auth.uid()
        )
      )
      OR (
        p_post.audience = 'GROUP'
        AND EXISTS (
          SELECT 1 FROM public.group_posts gp
          JOIN public.groups g ON g.id = gp.group_id
          WHERE gp.post_id = p_post.id
            AND (
              g.privacy = 'PUBLIC'
              OR public.is_group_member(gp.group_id, auth.uid())
            )
        )
      )
    );
$$;

-- Auto profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
  v_handle text;
BEGIN
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Usuário');
  v_handle := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'handle', ''),
    '@' || lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'))
  );

  INSERT INTO public.users (id, name, handle, avatar_url)
  VALUES (
    NEW.id,
    v_name,
    v_handle,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_settings (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Notification helper
CREATE OR REPLACE FUNCTION public.create_notification(
  p_recipient_id uuid,
  p_actor_id uuid,
  p_type notification_type,
  p_post_id uuid DEFAULT NULL,
  p_comment_id uuid DEFAULT NULL,
  p_group_id uuid DEFAULT NULL,
  p_body text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_recipient_id = p_actor_id THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.notifications (recipient_id, actor_id, type, post_id, comment_id, group_id, body)
  VALUES (p_recipient_id, p_actor_id, p_type, p_post_id, p_comment_id, p_group_id, p_body)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- RPCs used by the app
CREATE OR REPLACE FUNCTION public.toggle_follow(p_following_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me uuid := auth.uid();
  v_exists boolean;
BEGIN
  IF v_me IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF v_me = p_following_id THEN
    RAISE EXCEPTION 'cannot follow yourself';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.follows WHERE follower_id = v_me AND following_id = p_following_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.follows WHERE follower_id = v_me AND following_id = p_following_id;
    RETURN jsonb_build_object('following', false);
  ELSE
    INSERT INTO public.follows (follower_id, following_id) VALUES (v_me, p_following_id);
    PERFORM public.create_notification(p_following_id, v_me, 'FOLLOW');
    RETURN jsonb_build_object('following', true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.toggle_like_post(p_post_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me uuid := auth.uid();
  v_exists boolean;
  v_author uuid;
  v_count bigint;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.likes WHERE user_id = v_me AND post_id = p_post_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.likes WHERE user_id = v_me AND post_id = p_post_id;
  ELSE
    INSERT INTO public.likes (user_id, post_id) VALUES (v_me, p_post_id);
    SELECT author_id INTO v_author FROM public.posts WHERE id = p_post_id;
    PERFORM public.create_notification(v_author, v_me, 'LIKE', p_post_id);
  END IF;

  SELECT count(*) INTO v_count FROM public.likes WHERE post_id = p_post_id;
  RETURN jsonb_build_object('liked', NOT v_exists, 'likes', v_count);
END;
$$;

CREATE OR REPLACE FUNCTION public.toggle_bookmark(p_post_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me uuid := auth.uid();
  v_exists boolean;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.bookmarks WHERE user_id = v_me AND post_id = p_post_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.bookmarks WHERE user_id = v_me AND post_id = p_post_id;
    RETURN jsonb_build_object('bookmarked', false);
  ELSE
    INSERT INTO public.bookmarks (user_id, post_id) VALUES (v_me, p_post_id);
    RETURN jsonb_build_object('bookmarked', true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.toggle_reaction(p_post_id uuid, p_emoji text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me uuid := auth.uid();
  v_exists boolean;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.reactions WHERE user_id = v_me AND post_id = p_post_id AND emoji = p_emoji
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.reactions WHERE user_id = v_me AND post_id = p_post_id AND emoji = p_emoji;
    RETURN jsonb_build_object('reacted', false, 'emoji', p_emoji);
  ELSE
    INSERT INTO public.reactions (user_id, post_id, emoji) VALUES (v_me, p_post_id, p_emoji);
    RETURN jsonb_build_object('reacted', true, 'emoji', p_emoji);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_notifications_read(p_ids uuid[] DEFAULT NULL)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me uuid := auth.uid();
  v_count int;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  IF p_ids IS NULL THEN
    UPDATE public.notifications SET is_read = true
    WHERE recipient_id = v_me AND is_read = false;
  ELSE
    UPDATE public.notifications SET is_read = true
    WHERE recipient_id = v_me AND id = ANY(p_ids);
  END IF;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_group(p_group_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me uuid := auth.uid();
  v_privacy privacy;
BEGIN
  IF v_me IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT privacy INTO v_privacy FROM public.groups WHERE id = p_group_id AND deleted_at IS NULL;
  IF v_privacy IS NULL THEN RAISE EXCEPTION 'group not found'; END IF;

  INSERT INTO public.group_members (group_id, user_id, role, status)
  VALUES (
    p_group_id,
    v_me,
    'MEMBER',
    CASE WHEN v_privacy = 'PRIVATE' THEN 'PENDING'::group_member_status ELSE 'ACTIVE'::group_member_status END
  )
  ON CONFLICT (group_id, user_id) DO UPDATE
    SET status = EXCLUDED.status
    WHERE public.group_members.status <> 'BANNED';

  RETURN jsonb_build_object(
    'joined', v_privacy = 'PUBLIC',
    'pending', v_privacy = 'PRIVATE'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_feed(p_limit int DEFAULT 20, p_offset int DEFAULT 0)
RETURNS TABLE (
  id uuid,
  author_id uuid,
  author_name text,
  author_handle text,
  author_avatar text,
  body text,
  created_at timestamptz,
  likes_count bigint,
  comments_count bigint,
  image_url text
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.author_id,
    u.name AS author_name,
    u.handle AS author_handle,
    u.avatar_url AS author_avatar,
    p.body,
    p.created_at,
    (SELECT count(*) FROM public.likes l WHERE l.post_id = p.id) AS likes_count,
    (SELECT count(*) FROM public.comments c WHERE c.post_id = p.id AND c.deleted_at IS NULL) AS comments_count,
    (
      SELECT m.url
      FROM public.post_media pm
      JOIN public.media m ON m.id = pm.media_id
      WHERE pm.post_id = p.id
      ORDER BY pm."order"
      LIMIT 1
    ) AS image_url
  FROM public.posts p
  JOIN public.users u ON u.id = p.author_id
  WHERE p.deleted_at IS NULL
    AND public.can_view_post(p)
  ORDER BY p.created_at DESC
  LIMIT GREATEST(p_limit, 1)
  OFFSET GREATEST(p_offset, 0);
$$;

-- ENABLE RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- USERS
DROP POLICY IF EXISTS users_select ON public.users;
CREATE POLICY users_select ON public.users FOR SELECT TO authenticated, anon
  USING (true);
DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own ON public.users FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- FOLLOWS
DROP POLICY IF EXISTS follows_select ON public.follows;
CREATE POLICY follows_select ON public.follows FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS follows_insert ON public.follows;
CREATE POLICY follows_insert ON public.follows FOR INSERT TO authenticated
  WITH CHECK (follower_id = auth.uid());
DROP POLICY IF EXISTS follows_delete ON public.follows;
CREATE POLICY follows_delete ON public.follows FOR DELETE TO authenticated
  USING (follower_id = auth.uid());

-- INTERESTS (read-all)
DROP POLICY IF EXISTS interests_select ON public.interests;
CREATE POLICY interests_select ON public.interests FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS user_interests_select ON public.user_interests;
CREATE POLICY user_interests_select ON public.user_interests FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS user_interests_manage ON public.user_interests;
CREATE POLICY user_interests_manage ON public.user_interests FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- GROUPS
DROP POLICY IF EXISTS groups_select ON public.groups;
CREATE POLICY groups_select ON public.groups FOR SELECT TO authenticated, anon
  USING (
    deleted_at IS NULL
    AND (privacy = 'PUBLIC' OR public.is_group_member(id, auth.uid()) OR auth.uid() IS NOT NULL)
  );
-- Note: private groups still discoverable by slug for invite UX; membership gates content
DROP POLICY IF EXISTS groups_insert ON public.groups;
CREATE POLICY groups_insert ON public.groups FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS groups_update ON public.groups;
CREATE POLICY groups_update ON public.groups FOR UPDATE TO authenticated
  USING (public.is_group_admin(id, auth.uid()));

DROP POLICY IF EXISTS group_interests_select ON public.group_interests;
CREATE POLICY group_interests_select ON public.group_interests FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS group_members_select ON public.group_members;
CREATE POLICY group_members_select ON public.group_members FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS group_members_insert ON public.group_members;
CREATE POLICY group_members_insert ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_group_admin(group_id, auth.uid()));
DROP POLICY IF EXISTS group_members_update ON public.group_members;
CREATE POLICY group_members_update ON public.group_members FOR UPDATE TO authenticated
  USING (public.is_group_admin(group_id, auth.uid()) OR user_id = auth.uid());
DROP POLICY IF EXISTS group_members_delete ON public.group_members;
CREATE POLICY group_members_delete ON public.group_members FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_group_admin(group_id, auth.uid()));

-- MEDIA / POSTS
DROP POLICY IF EXISTS media_select ON public.media;
CREATE POLICY media_select ON public.media FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS media_insert ON public.media;
CREATE POLICY media_insert ON public.media FOR INSERT TO authenticated
  WITH CHECK (uploader_id = auth.uid());
DROP POLICY IF EXISTS media_delete ON public.media;
CREATE POLICY media_delete ON public.media FOR DELETE TO authenticated
  USING (uploader_id = auth.uid());

DROP POLICY IF EXISTS posts_select ON public.posts;
CREATE POLICY posts_select ON public.posts FOR SELECT TO authenticated, anon
  USING (public.can_view_post(posts));
DROP POLICY IF EXISTS posts_insert ON public.posts;
CREATE POLICY posts_insert ON public.posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS posts_update ON public.posts;
CREATE POLICY posts_update ON public.posts FOR UPDATE TO authenticated
  USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS posts_delete ON public.posts;
CREATE POLICY posts_delete ON public.posts FOR DELETE TO authenticated
  USING (author_id = auth.uid());

DROP POLICY IF EXISTS post_media_select ON public.post_media;
CREATE POLICY post_media_select ON public.post_media FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS post_media_write ON public.post_media;
CREATE POLICY post_media_write ON public.post_media FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid()));

DROP POLICY IF EXISTS post_tags_select ON public.post_tags;
CREATE POLICY post_tags_select ON public.post_tags FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS post_tags_write ON public.post_tags;
CREATE POLICY post_tags_write ON public.post_tags FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid()));

DROP POLICY IF EXISTS post_mentions_select ON public.post_mentions;
CREATE POLICY post_mentions_select ON public.post_mentions FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS post_mentions_write ON public.post_mentions;
CREATE POLICY post_mentions_write ON public.post_mentions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid()));

DROP POLICY IF EXISTS group_posts_select ON public.group_posts;
CREATE POLICY group_posts_select ON public.group_posts FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS group_posts_insert ON public.group_posts;
CREATE POLICY group_posts_insert ON public.group_posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND public.is_group_member(group_id, auth.uid()));

-- STORIES
DROP POLICY IF EXISTS stories_select ON public.stories;
CREATE POLICY stories_select ON public.stories FOR SELECT TO authenticated, anon
  USING (deleted_at IS NULL AND status = 'ACTIVE' AND expires_at > now());
DROP POLICY IF EXISTS stories_insert ON public.stories;
CREATE POLICY stories_insert ON public.stories FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS stories_update ON public.stories;
CREATE POLICY stories_update ON public.stories FOR UPDATE TO authenticated
  USING (author_id = auth.uid());

DROP POLICY IF EXISTS story_views_select ON public.story_views;
CREATE POLICY story_views_select ON public.story_views FOR SELECT TO authenticated
  USING (
    viewer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND s.author_id = auth.uid())
  );
DROP POLICY IF EXISTS story_views_insert ON public.story_views;
CREATE POLICY story_views_insert ON public.story_views FOR INSERT TO authenticated
  WITH CHECK (viewer_id = auth.uid());

DROP POLICY IF EXISTS story_replies_select ON public.story_replies;
CREATE POLICY story_replies_select ON public.story_replies FOR SELECT TO authenticated
  USING (
    sender_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND s.author_id = auth.uid())
  );
DROP POLICY IF EXISTS story_replies_insert ON public.story_replies;
CREATE POLICY story_replies_insert ON public.story_replies FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- COMMENTS / LIKES / REACTIONS / BOOKMARKS
DROP POLICY IF EXISTS comments_select ON public.comments;
CREATE POLICY comments_select ON public.comments FOR SELECT TO authenticated, anon
  USING (deleted_at IS NULL);
DROP POLICY IF EXISTS comments_insert ON public.comments;
CREATE POLICY comments_insert ON public.comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS comments_update ON public.comments;
CREATE POLICY comments_update ON public.comments FOR UPDATE TO authenticated
  USING (author_id = auth.uid());
DROP POLICY IF EXISTS comments_delete ON public.comments;
CREATE POLICY comments_delete ON public.comments FOR DELETE TO authenticated
  USING (author_id = auth.uid());

DROP POLICY IF EXISTS likes_select ON public.likes;
CREATE POLICY likes_select ON public.likes FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS likes_insert ON public.likes;
CREATE POLICY likes_insert ON public.likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS likes_delete ON public.likes;
CREATE POLICY likes_delete ON public.likes FOR DELETE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS reactions_select ON public.reactions;
CREATE POLICY reactions_select ON public.reactions FOR SELECT TO authenticated, anon USING (true);
DROP POLICY IF EXISTS reactions_insert ON public.reactions;
CREATE POLICY reactions_insert ON public.reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS reactions_delete ON public.reactions;
CREATE POLICY reactions_delete ON public.reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS bookmarks_select ON public.bookmarks;
CREATE POLICY bookmarks_select ON public.bookmarks FOR SELECT TO authenticated
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS bookmarks_write ON public.bookmarks;
CREATE POLICY bookmarks_write ON public.bookmarks FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- MESSAGES
DROP POLICY IF EXISTS conversations_select ON public.conversations;
CREATE POLICY conversations_select ON public.conversations FOR SELECT TO authenticated
  USING (public.is_conversation_participant(id, auth.uid()));
DROP POLICY IF EXISTS conversations_insert ON public.conversations;
CREATE POLICY conversations_insert ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS conversation_participants_select ON public.conversation_participants;
CREATE POLICY conversation_participants_select ON public.conversation_participants FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));
DROP POLICY IF EXISTS conversation_participants_insert ON public.conversation_participants;
CREATE POLICY conversation_participants_insert ON public.conversation_participants FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_conversation_participant(conversation_id, auth.uid()));
DROP POLICY IF EXISTS conversation_participants_update ON public.conversation_participants;
CREATE POLICY conversation_participants_update ON public.conversation_participants FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS messages_select ON public.messages;
CREATE POLICY messages_select ON public.messages FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()) AND deleted_at IS NULL);
DROP POLICY IF EXISTS messages_insert ON public.messages;
CREATE POLICY messages_insert ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.is_conversation_participant(conversation_id, auth.uid()));
DROP POLICY IF EXISTS messages_update ON public.messages;
CREATE POLICY messages_update ON public.messages FOR UPDATE TO authenticated
  USING (sender_id = auth.uid());

-- NOTIFICATIONS / SETTINGS / SEARCH
DROP POLICY IF EXISTS notifications_select ON public.notifications;
CREATE POLICY notifications_select ON public.notifications FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());
DROP POLICY IF EXISTS notifications_update ON public.notifications;
CREATE POLICY notifications_update ON public.notifications FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS user_settings_all ON public.user_settings;
CREATE POLICY user_settings_all ON public.user_settings FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS notification_prefs_all ON public.notification_preferences;
CREATE POLICY notification_prefs_all ON public.notification_preferences FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS search_history_all ON public.search_history;
CREATE POLICY search_history_all ON public.search_history FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_follow(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_like_post(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_bookmark(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_reaction(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_group(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_feed(int, int) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_notification(uuid, uuid, notification_type, uuid, uuid, uuid, text) TO authenticated;
