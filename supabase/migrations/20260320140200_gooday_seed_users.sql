-- Gooday seed from frontend mocks
-- Demo password for all seeded accounts: Gooday@2026

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fixed demo user ids
-- marcos a0000000-0000-4000-8000-000000000001
-- bruna  ...0002, pedro ...0003, renata ...0004, tiago ...0005
-- nicole ...0006, bruno ...0007, julia ...0008, lidiane ...0009
-- camila ...000a, marina ...000b, lu ...000c, ana ...000d, ciclo ...000e

DO $$
DECLARE
  inst uuid := '00000000-0000-0000-0000-000000000000';
  pwd text := crypt('Gooday@2026', gen_salt('bf'));
  u record;
BEGIN
  FOR u IN
    SELECT * FROM (VALUES
      ('a0000000-0000-4000-8000-000000000001'::uuid, 'marcos@gooday.app', 'Marcos Vinícius', '@marcos_v', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=160&h=160'),
      ('a0000000-0000-4000-8000-000000000002'::uuid, 'bruna@gooday.app', 'Bruna Carla', '@bruna_carla', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=160&h=160'),
      ('a0000000-0000-4000-8000-000000000003'::uuid, 'pedro@gooday.app', 'Pedro Run', '@pedro.run', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=160&h=160'),
      ('a0000000-0000-4000-8000-000000000004'::uuid, 'renata@gooday.app', 'Renata Silva', '@renata_silva', '/assets/0b179.png'),
      ('a0000000-0000-4000-8000-000000000005'::uuid, 'tiago@gooday.app', 'Tiago Souza', '@tiago_souza', '/assets/4b35d.png'),
      ('a0000000-0000-4000-8000-000000000006'::uuid, 'nicole@gooday.app', 'Nicole Bueno', '@nicole_bueno', '/assets/7c77a.png'),
      ('a0000000-0000-4000-8000-000000000007'::uuid, 'bruno@gooday.app', 'Bruno Mendes', '@bruno_mendes', '/assets/2f96e.png'),
      ('a0000000-0000-4000-8000-000000000008'::uuid, 'julia@gooday.app', 'Júlia Andrade', '@julia_andrade', '/assets/a35b8.png'),
      ('a0000000-0000-4000-8000-000000000009'::uuid, 'lidiane@gooday.app', 'Lidiane Costa', '@lidiane_costa', '/assets/988ee.png'),
      ('a0000000-0000-4000-8000-00000000000a'::uuid, 'camila@gooday.app', 'Camila Ferreira', '@camila_ferreira', 'https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=160&h=160'),
      ('a0000000-0000-4000-8000-00000000000b'::uuid, 'marina@gooday.app', 'Marina Rocha', '@marina_rocha', 'https://images.unsplash.com/photo-1701096351544-7de3c7fa0272?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=160&h=160'),
      ('a0000000-0000-4000-8000-00000000000c'::uuid, 'lu@gooday.app', 'Lu Trails', '@lu_trails', 'https://images.unsplash.com/photo-1589729132389-8f0e0b55b91e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=160&h=160'),
      ('a0000000-0000-4000-8000-00000000000d'::uuid, 'ana@gooday.app', 'Ana Move', '@ana_move', 'https://images.unsplash.com/photo-1701096351544-7de3c7fa0272?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=160&h=160'),
      ('a0000000-0000-4000-8000-00000000000e'::uuid, 'ciclo@gooday.app', 'Ciclo Urb', '@ciclo_urb', 'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=160&h=160')
    ) AS t(id, email, name, handle, avatar)
  LOOP
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      inst, u.id, 'authenticated', 'authenticated', u.email, pwd, now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', u.name, 'handle', u.handle, 'avatar_url', u.avatar),
      now(), now(), '', '', '', ''
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
      u.id, u.id,
      jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
      'email', u.id::text, now(), now(), now()
    ) ON CONFLICT DO NOTHING;

    UPDATE public.users
    SET name = u.name,
        handle = u.handle,
        avatar_url = u.avatar,
        bio = CASE
          WHEN u.handle = '@marcos_v' THEN 'Corrida, alimentação consciente e bem-estar no dia a dia.'
          WHEN u.handle = '@bruna_carla' THEN 'Nutrição, sucos naturais e movimento leve.'
          WHEN u.handle = '@pedro.run' THEN '10K, trail e mentalidade forte.'
          ELSE 'Vida saudável com a comunidade Gooday.'
        END,
        location = CASE WHEN u.handle = '@marcos_v' THEN 'São Paulo, BR' ELSE location END,
        cover_url = CASE
          WHEN u.handle = '@marcos_v' THEN 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900'
          WHEN u.handle = '@bruna_carla' THEN 'https://images.unsplash.com/photo-1540420773420-3366772f4999?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900'
          WHEN u.handle = '@pedro.run' THEN 'https://images.unsplash.com/photo-1530143311094-34d807799e8f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900'
          ELSE cover_url
        END
    WHERE id = u.id;
  END LOOP;
END $$;
