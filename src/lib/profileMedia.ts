import { supabase } from '@/lib/supabase'

const AVATARS_BUCKET = 'avatars'

function extensionFromMime(mime: string): string {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  return 'jpg'
}

export async function uploadOwnProfileImage(
  userId: string,
  file: File,
  kind: 'avatar' | 'cover',
): Promise<{ publicUrl: string }> {
  if (!userId) throw new Error('Usuário não autenticado')
  if (!file.type.startsWith('image/')) throw new Error('Selecione uma imagem válida')
  if (file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5 MB')

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user || user.id !== userId) {
    throw new Error('Só o dono do perfil pode alterar esta foto')
  }

  const ext = extensionFromMime(file.type)
  const path = `${userId}/${kind}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: '3600',
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path)
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`

  const column = kind === 'avatar' ? 'avatar_url' : 'cover_url'
  const { error: updateError } = await supabase
    .from('users')
    .update({ [column]: publicUrl })
    .eq('id', userId)

  if (updateError) throw updateError

  return { publicUrl }
}
