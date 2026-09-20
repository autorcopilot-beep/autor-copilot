# Autenticação e sessão

## Fluxos

O cadastro confirma o e-mail por `/auth/callback?next=/onboarding`. A
recuperação usa o mesmo callback com destino `/update-password`. O callback
aceita apenas destinos internos definidos em `features/auth/redirects.ts`.

Depois do login, o perfil decide o destino:

- onboarding incompleto → `/onboarding`;
- onboarding completo → `/dashboard`.

Ao trocar a senha, os refresh tokens das sessões anteriores são revogados e a
pessoa precisa entrar novamente.

As rotas `/dashboard` e `/account` exigem sessão válida. A central da conta
permite alterar o e-mail em `/account/login`: o Supabase envia a confirmação
para o novo endereço e o endereço anterior permanece ativo até a confirmação.
O retorno passa pelo callback PKCE e aceita somente o destino interno
`/account/login`.

## Perfil e identidade

- O nome de usuário público usa o formato `@usuario_10`.
- O valor salvo não inclui `@` e aceita letras minúsculas, números e
  sublinhado, com 3 a 24 caracteres.
- A unicidade é garantida pelo banco, além da validação amigável no formulário.
- A foto de perfil fica no bucket privado `profile-avatars`.
- O banco armazena somente `avatar_path`; URLs assinadas são criadas no
  servidor por tempo limitado.
- As políticas do Storage limitam leitura, envio e exclusão à pasta do próprio
  usuário.

## Proteção

- O navegador recebe somente URL e publishable key.
- Server Actions validam todos os formulários com Zod.
- Páginas privadas usam `auth.getClaims()`; cookies não verificados não
  autorizam conteúdo.
- O Proxy do Next.js 16 renova a sessão e devolve os cookies atualizados.
- Erros de login não distinguem e-mail inexistente, senha incorreta ou conta
  ainda não confirmada.
- Recuperação sempre apresenta uma resposta neutra para evitar enumeração de
  contas.
- O acesso ao perfil continua limitado pelas políticas RLS do banco.

## Teste manual

1. Criar uma conta em `/register` e confirmar o e-mail.
2. Completar o perfil e verificar o redirecionamento para `/dashboard`.
3. Encerrar a sessão pelo painel da conta.
4. Entrar novamente e confirmar que o onboarding é ignorado.
5. Solicitar recuperação em `/forgot-password`.
6. Abrir o link recebido, criar outra senha e entrar novamente.
7. Tentar abrir `/dashboard` sem sessão e confirmar o retorno para `/login`.
8. Alterar o e-mail em `/account/login`, confirmar pelo link recebido e
   verificar o retorno à central da conta.
9. Enviar, substituir e remover a foto em `/account/profile`.

No Supabase, `NEXT_PUBLIC_SITE_URL/auth/callback` precisa estar entre as URLs de
redirecionamento permitidas. Configure SMTP próprio antes de produção.
