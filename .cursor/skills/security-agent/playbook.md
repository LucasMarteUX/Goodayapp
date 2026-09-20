# Security Agent — Playbook completo

Documento de política do **Security Engineer**. Aplicar integralmente em cada auditoria.

---

# 1. OBJETIVO PRINCIPAL

Garantir segurança em todas as camadas da aplicação:

* autenticação;
* autorização;
* rotas;
* APIs;
* Server Actions;
* banco de dados;
* PostgreSQL;
* Supabase;
* sessões;
* cookies;
* rate limiting;
* proteção contra brute force;
* proteção contra abuso de APIs;
* proteção contra DDoS em nível de aplicação;
* secrets;
* variáveis de ambiente;
* uploads;
* webhooks;
* logs;
* dependências;
* permissões;
* RLS;
* acesso administrativo;
* exposição de dados.

Antes de implementar qualquer alteração:

1. Analise a arquitetura atual.
2. Identifique framework, autenticação, banco e infraestrutura.
3. Reutilize os mecanismos existentes sempre que forem seguros.
4. Evite criar autenticações duplicadas ou sistemas paralelos desnecessários.
5. Preserve funcionalidades existentes.

---

# 2. PROTEÇÃO GLOBAL DE ROTAS

Faça um levantamento completo de todas as rotas existentes no projeto.

Classifique cada rota como:

* pública;
* autenticada;
* administrativa;
* API;
* webhook;
* interna;
* callback de autenticação.

Crie uma política **deny by default**.

Isso significa:

> Toda rota deve ser considerada privada por padrão, exceto aquelas explicitamente declaradas públicas.

Não dependa apenas da interface para proteger uma página.

Esconder botões ou menus NÃO é segurança.

A proteção deve acontecer no servidor.

### SPA + Supabase (mapeamento)

Em apps Vite/React sem backend próprio:

* “rota” = tela/estado de navegação **e** toda operação de dados (query/RPC/Storage);
* deny-by-default no **Postgres via RLS**;
* gate de UI (`AuthProvider` / redirect login) é defesa em profundidade, não a única.

---

# 3. AUTENTICAÇÃO EM TODAS AS ROTAS PRIVADAS

Todas as rotas privadas devem executar a função central de autenticação utilizada pelo projeto, por exemplo:

`auth()`

ou mecanismo equivalente existente (ex.: `supabase.auth.getSession()` / `getUser()` no servidor ou Edge Function).

Sempre validar a sessão no servidor.

Nunca confiar apenas em:

* localStorage;
* sessionStorage;
* estado React;
* parâmetros de URL;
* cookies manipuláveis pelo cliente.

Se a sessão for inválida, expirada ou inexistente:

1. interrompa imediatamente a execução;
2. não carregue dados protegidos;
3. não execute queries;
4. não renderize informações privadas;
5. redirecione o usuário para a rota de autenticação definida pelo projeto.

Utilize a rota existente, como por exemplo:

`/auth`

ou a rota equivalente encontrada no sistema (ex.: tela `login` / `AuthScreen`).

Não invente outra rota se uma já existir.

---

# 4. AUTORIZAÇÃO

Autenticação e autorização devem ser tratadas separadamente.

Uma sessão válida não significa que o usuário possui acesso a qualquer recurso.

Verifique:

* role;
* permissões;
* ownership;
* organização;
* tenant;
* workspace;
* resource owner.

Exemplo:

Um usuário comum tentando acessar:

`/admin`

deve receber bloqueio mesmo estando autenticado.

Da mesma maneira:

`/api/users/123`

não deve retornar informações do usuário 123 apenas porque outro usuário autenticado alterou o ID da URL.

Sempre verificar ownership no servidor.

No Gooday: `is_admin` e policies `admin_all` devem ser auditadas; usuários comuns nunca herdam privilégios admin por engano.

---

# 5. PROTEÇÃO CONTRA IDOR

Audite o sistema procurando vulnerabilidades de:

**IDOR — Insecure Direct Object Reference**

Exemplos:

`/users/123`

`/orders/456`

`/projects/789`

`/api/leads?id=123`

Nunca considere um ID enviado pelo frontend como autorização suficiente.

Antes de retornar ou modificar qualquer recurso:

* valide identidade;
* valide permissão;
* valide ownership;
* valide tenant/workspace quando existir.

Checklist Gooday típico:

* `fetchProfileByKey(id)` — perfil público vs campos privados;
* `join_group` — só o próprio `auth.uid()`;
* update bio/avatar — só `users.id = auth.uid()`;
* posts/comments — ownership no UPDATE/DELETE;
* Storage paths — pasta do próprio user.

---

# 6. RATE LIMIT DE LOGIN

Implemente proteção contra brute force no sistema de autenticação.

A proteção deve considerar preferencialmente uma combinação de:

* IP;
* usuário/e-mail;
* fingerprint ou sessão quando disponível.

Nunca dependa exclusivamente do IP, pois vários usuários podem compartilhar a mesma conexão.

Aplicar política progressiva.

Sugestão inicial:

### Tentativas 1–5

Login permitido normalmente.

### Tentativa 6

Bloquear novas tentativas por:

`30 segundos`

### Tentativa 7

Bloquear por:

`1 minuto`

### Tentativa 8

Bloquear por:

`5 minutos`

### Tentativa 9

Bloquear por:

`15 minutos`

### Tentativa 10+

Bloquear por:

`30 minutos`

Se houver abuso persistente:

bloquear temporariamente por até:

`1 hora`

A janela de contagem pode considerar aproximadamente:

`15 minutos`

de atividade.

Depois de um login bem-sucedido:

* resetar ou reduzir adequadamente o contador;
* não manter punições indefinidamente.

### Onde implementar (Supabase)

Preferência:

1. Supabase Auth rate limits / captcha (projeto);
2. Edge Function proxy de login com contador (Redis/KV/tabela);
3. fallback client-side **apenas** como UX (não é segurança real).

Documente se o projeto ainda depende só do rate limit da plataforma.

---

# 7. PROTEÇÃO CONTRA USER ENUMERATION

A autenticação nunca deve revelar se um usuário existe.

Evitar respostas como:

* "usuário não encontrado";
* "e-mail não cadastrado";
* "senha incorreta para este usuário".

Utilizar mensagens genéricas, por exemplo:

`E-mail ou senha inválidos.`

O tempo de resposta também deve ser semelhante entre usuário existente e inexistente sempre que possível.

Signup / recovery: mensagens também genéricas quando a política do produto permitir (“Se o e-mail existir, enviamos instruções”).

---

# 8. RATE LIMIT GLOBAL DE API

Faça um inventário de endpoints que podem ser abusados.

Exemplos:

* login;
* signup;
* recuperação de senha;
* envio de e-mail;
* geração de IA;
* busca;
* criação de registros;
* uploads;
* geração de relatórios;
* APIs públicas;
* webhooks;
* endpoints que executam queries pesadas.

Não utilizar necessariamente o mesmo limite para todas as APIs.

Defina limites considerando o custo de cada operação.

Como baseline inicial:

### APIs leves

Máximo aproximado:

`60 requests/minuto por usuário`

ou

`100 requests/minuto por IP`

### APIs de escrita

Máximo aproximado:

`20–30 requests/minuto`

### Operações caras

Exemplo:

* geração por IA;
* exportações;
* processamento;
* consultas complexas;
* relatórios.

Utilizar limites significativamente menores.

Exemplo:

`5–10 requests/minuto`

Ajuste esses valores conforme a arquitetura real do projeto.

---

# 9. PROTEÇÃO DO POSTGRESQL

Analise APIs e queries que possam provocar sobrecarga no PostgreSQL.

Procure especialmente:

* queries sem limite;
* SELECT de tabelas inteiras;
* filtros sem índice;
* loops realizando queries;
* N+1 queries;
* endpoints permitindo paginação ilimitada;
* pesquisas com wildcard pesado;
* queries chamadas repetidamente pelo frontend;
* polling excessivo;
* subscriptions desnecessárias;
* joins extremamente caros;
* endpoints que executam várias queries simultâneas.

Todas as listas devem possuir paginação.

Nunca permitir valores arbitrários como:

`limit=100000`

Defina um limite máximo.

Exemplo:

`MAX_PAGE_SIZE = 100`

Mesmo que o frontend solicite valor maior, limite no servidor (RPC / Edge Function).

---

# 10. PROTEÇÃO CONTRA DATABASE FLOOD

Uma pessoa não deve conseguir derrubar o banco executando milhares de requests em poucos segundos.

Crie proteção em camadas:

1. rate limit;
2. autenticação;
3. autorização;
4. limite de paginação;
5. timeout;
6. índices adequados;
7. cache quando apropriado;
8. deduplicação de requests;
9. limites de operações concorrentes;
10. validação de payload.

Identifique endpoints especialmente perigosos.

---

# 11. SUPABASE E ROW LEVEL SECURITY

Se o projeto utilizar Supabase:

Faça auditoria completa das políticas RLS.

Verifique **todas** as tabelas.

Tabelas contendo dados privados devem utilizar:

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
```

E policies explícitas para `SELECT`, `INSERT`, `UPDATE`, `DELETE` conforme o caso.

### Regras obrigatórias

1. **RLS ligado** em toda tabela de dados de usuário.
2. Nunca deixar tabela privada só com grants e sem policy (default deny com RLS on + sem policy = bloqueio; sem RLS = exposição).
3. Policies devem usar `auth.uid()` (ou claims JWT) — não IDs vindos só do client sem checagem.
4. Evitar `USING (true)` / `WITH CHECK (true)` em dados privados.
5. `SECURITY DEFINER` em RPCs: auditar corpo da função; `search_path` fixo; checar `auth.uid()` dentro da função; privilégio mínimo.
6. **Nunca** expor `service_role` no frontend (`VITE_*`, bundle, repo).
7. Frontend usa apenas **anon/publishable key**.
8. Storage buckets: policies por pasta/`auth.uid()`; MIME/size limits.
9. Tabelas admin (`is_admin`): policy separada e testada; usuário comum não passa.
10. Seed/demo: não deixar senhas fracas documentadas em produção sem aviso.

### Checklist por tabela

Para cada tabela em `supabase/migrations/`:

| Tabela | RLS on? | SELECT | INSERT | UPDATE | DELETE | Notas |
|--------|---------|--------|--------|--------|--------|-------|
| … | | | | | | |

Testar com dois usuários reais (ou JWT de teste): owner vs stranger vs admin.

---

# 12. SECRETS E VARIÁVEIS DE AMBIENTE

* `.env` no `.gitignore`; nunca commitado.
* `.env.example` só com placeholders.
* Proibido no frontend: `SERVICE_ROLE`, DB password, webhook secrets, private keys.
* Revisar bundle (`pnpm build`) por vazamento acidental.
* Rotacionar qualquer secret que tenha sido commitado historicamente.

---

# 13. UPLOADS E STORAGE

* Validar tipo MIME e extensão no servidor/policy.
* Limitar tamanho.
* Path previsível sob `user_id/…`.
* Não servir executáveis.
* URLs públicas só quando o produto exigir; preferir signed URLs para privado.
* Sanitizar nomes de arquivo.

---

# 14. WEBHOOKS E CALLBACKS

* Verificar assinatura (HMAC / provider secret).
* Idempotência.
* Timeout curto.
* Não confiar no body sem validação de schema.
* Rate limit no endpoint.

---

# 15. LOGS E OBSERVABILIDADE

* Não logar senha, token, refresh, Authorization header, cartão, PII sensível.
* Erros genéricos para o cliente; detalhe só em logs server-side.
* Alertas para picos de 401/429/5xx.

---

# 16. DEPENDÊNCIAS

* Auditar `pnpm audit` / advisory.
* Evitar pacotes abandonados com CVEs críticos.
* Travar versões no lockfile.
* Não instalar dependência só para “facilitar” se aumentar superfície (eval, shell).

---

# 17. HEADERS E FRONTEND

Mesmo em SPA hospedada (Vercel etc.):

* HTTPS only;
* não guardar secrets no `localStorage` além do necessário ao auth provider;
* XSS: React escapa por padrão — evitar `dangerouslySetInnerHTML` com input de usuário;
* CSRF: relevante se houver cookies de sessão same-site; alinhar com modo do Supabase Auth.

---

# 18. ACESSO ADMINISTRATIVO

* Admin só via claim/`is_admin` verificado no servidor (RLS/RPC).
* Sem “admin mode” no query string.
* Ações destrutivas com confirmação + audit log quando possível.
* Conta admin de demo: senha forte em produção; documentar risco em ambientes de workshop.

---

# 19. ORDEM DE REMEDIAÇÃO

1. Secrets expostos / RLS off / IDOR de escrita
2. Auth bypass / privilege escalation
3. Brute force / enumeration
4. Flood DB / unpaginated queries
5. Upload abuse
6. Headers / deps / hygiene

---

# 20. O QUE NÃO FAZER

* “Corrigir” desligando RLS
* Duplicar auth JWT caseiro sem necessidade
* Confiar só em `if (!user) return` no React
* Commitar `.env`
* Ampliar `SECURITY DEFINER` sem revisar
* Silenciar achados críticos

---

Fim do playbook. Use [report-template.md](report-template.md) para o entregável.
