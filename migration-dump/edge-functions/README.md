# Edge Functions Migration

Para deployar as edge functions no seu Supabase:

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link ao projeto
supabase link --project-ref [SEU_PROJECT_REF]

# 4. Copiar as pastas de edge-functions do projeto original para supabase/functions/

# 5. Configurar secrets
supabase secrets set GITHUB_TOKEN=seu_token
supabase secrets set LOVABLE_API_KEY=sua_key

# 6. Deploy
supabase functions deploy analyze-candidate
supabase functions deploy github-repos
supabase functions deploy github-tags
supabase functions deploy github-releases
supabase functions deploy invite-employee
```

As funções estão em `supabase/functions/` no projeto original.
