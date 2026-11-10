# Luan Moreira — Landing + Quiz Black Friday 2026

Landing page do Manual do Zero aos Primeiros Clientes com IA, com quiz de diagnóstico por cor de temperatura e painel de leads.

## Páginas
- `/` — landing page e quiz (8 etapas, 5 cores de temperatura, 3 textos por cor).
- `/painel` — painel de leads protegido por senha. Lista, busca, filtro por cor, ficha individual com data e hora, exclusão e download em PDF (um cadastro ou todos).

## Onde os leads ficam
Os cadastros são gravados no Supabase (projeto `lpxyezpikhixcclocsjy`), tabela `public.luan_bf_leads`.
- O site grava pela função `luan_bf_submit_lead` (só inserção).
- O painel lê pela função `luan_bf_admin_list`, que confere a senha no servidor. A tabela não pode ser lida diretamente pela chave pública.
- 15 senhas erradas em 15 minutos bloqueiam novas tentativas temporariamente.
- Se a internet do visitante falhar no envio, o cadastro fica guardado no navegador e é reenviado na próxima visita.

## Configurar o checkout
Edite `config.json`:
```json
{ "checkoutUrl": "https://pay.kiwify.com.br/uoR7FrU", "mentorshipUrl": "https://pay.kiwify.com.br/7h10JXu", "whatsapp": "5522998250466" }
```
`mentorshipUrl` é o checkout da mentoria (R$ 497). O Pixel Meta 1098029316394490 dispara PageView, Lead (fim do quiz), InitiateCheckout (cliques nos checkouts) e Contact (cliques no WhatsApp).

## Trocar a senha do painel
No SQL Editor do Supabase:
```sql
update public.luan_bf_admin set pass_hash = extensions.crypt('NOVA-SENHA', extensions.gen_salt('bf', 10)) where id = 1;
```
