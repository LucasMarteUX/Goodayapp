# Security Audit Report — Template

Preencher ao final de cada execução do Security Agent.

```markdown
# Security Audit Report

**Projeto:** <nome>
**Data:** <YYYY-MM-DD>
**Auditor:** Security Agent
**Stack:** <ex.: Vite + React + Supabase>

## Executive summary

<1 parágrafo: postura geral + top riscos>

## Architecture map

| Camada | Tecnologia | Notas de segurança |
|--------|------------|--------------------|
| Frontend | | |
| Auth | | |
| API / RPC | | |
| Database | | |
| Storage | | |
| Hosting | | |

## Route / surface inventory

| Superfície | Tipo | AuthN | AuthZ | Proteção server/RLS | Risco |
|------------|------|-------|-------|---------------------|-------|
| | public/auth/admin/api/… | | | | |

## Findings

### Critical

| ID | Finding | Local | Impacto | Status |
|----|---------|-------|---------|--------|
| C1 | | | | open/fixed |

### High

| ID | Finding | Local | Impacto | Status |
|----|---------|-------|---------|--------|
| H1 | | | | |

### Medium

| ID | Finding | Local | Impacto | Status |
|----|---------|-------|---------|--------|
| M1 | | | | |

### Low / Info

| ID | Finding | Local | Impacto | Status |
|----|---------|-------|---------|--------|
| L1 | | | | |

## RLS audit (Supabase)

| Tabela | RLS | Policies OK? | Problema | Ação |
|--------|-----|--------------|----------|------|
| | on/off | | | |

## Secrets & env

- [ ] `.env` ignorado
- [ ] sem `service_role` no frontend
- [ ] `.env.example` só placeholders
- [ ] sem secrets no git history recente

## Rate limiting

| Endpoint / fluxo | Limite atual | Adequado? | Gap |
|------------------|--------------|-----------|-----|
| login | | | |
| signup | | | |
| writes | | | |
| uploads | | | |

## Fixes applied this run

| Arquivo | Mudança | Risco mitigado |
|---------|---------|----------------|
| | | |

## Open items / residual risk

1. …
2. …

## Recommended tests

- [ ] Dois usuários: A não lê/escreve recurso de B (IDOR)
- [ ] Anon sem sessão: queries privadas falham
- [ ] Admin vs user comum
- [ ] Login com mensagem genérica
- [ ] Upload fora do path do user rejeitado
- [ ] `limit` abusivo rejeitado/clampado

## Conclusion

<postura: insecure / needs work / acceptable with residual risks>
```
