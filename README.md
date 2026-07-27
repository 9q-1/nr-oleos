# NR Lubrificantes — Super Troca de Óleo

Fundação do sistema interno de gestão. Esta é a **Fase 1** do projeto completo.

## O que já está pronto nesta fase

- **Stack configurada**: Next.js 15 (App Router), React 19, TypeScript, Tailwind, shadcn/ui, Framer Motion, TanStack Query, React Hook Form + Zod, Prisma.
- **Identidade visual**: tema dark por padrão (`#0D0D0D` + `#FFC107`), classes utilitárias `glass-card`, `brand-gradient-text`, `brand-btn`, `hover-lift` em `app/globals.css`.
- **Banco de dados completo** (`prisma/schema.prisma`): Usuários, Clientes, Veículos, Fornecedores, Produtos, Movimentos de Estoque, Serviços, Troca de Óleo, Filtros (via catálogo de Produtos), Radiador, Outros Serviços, Financeiro e Configurações da Empresa. Tudo com UUID, índices e `onDelete: Cascade` nos relacionamentos filho.
- **Seed inicial** (`prisma/seed.ts`): usuário admin (`admin@nrlubrificantes.com` / `nrlubrificantes123` — troque depois), configuração da empresa e um catálogo básico de produtos.
- **Helpers**: `lib/prisma.ts` (client singleton), `lib/utils.ts` (`cn`, formatação de moeda/data/placa).

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL/DIRECT_URL do Neon
npx shadcn@latest init  # gera os componentes base em components/ui (usa o components.json já configurado)
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## Fase 2 — Login + Dashboard (concluída)

Tudo abaixo já está implementado e consumindo o Neon via Prisma — nenhum dado estático:

- **Autenticação**: `lib/auth.ts` (JWT + cookie httpOnly), `middleware.ts` (protege `/dashboard` e demais rotas internas), `app/(auth)/login/actions.ts` (Server Action com bcrypt), `app/(auth)/login/login-form.tsx` (React Hook Form + Zod + Framer Motion).
- **Shell do dashboard**: `components/dashboard/sidebar.tsx` (recolhível, com persistência em localStorage), `components/dashboard/mobile-sidebar.tsx` (drawer via Sheet no mobile), `components/dashboard/header.tsx` (busca global, notificações, perfil).
- **Busca global**: `⌘K`/`Ctrl+K` abre um command palette (`components/dashboard/global-search.tsx`) que consulta clientes, veículos (por placa) e produtos via `app/actions/search.ts` → `lib/data/search.ts`.
- **Notificações**: `lib/data/notifications.ts` calcula trocas vencidas, trocas de hoje e estoque baixo em tempo real, exibidas em `components/dashboard/notifications.tsx`.
- **Dashboard com dados reais** (`lib/data/dashboard.ts`): clientes, veículos, serviços hoje/mês, faturamento do mês, trocas vencidas, estoque baixo, últimos atendimentos, clientes a contatar hoje, série de serviços por dia (14 dias) e produtos mais utilizados — tudo via agregações Prisma (`count`, `aggregate`, `groupBy`, `$queryRaw` para o filtro de estoque mínimo).
- **UI**: cards com efeito glass, gráficos (`recharts`), skeletons de carregamento por seção (streaming via `Suspense`), toasts (`sonner`), atalhos rápidos (Novo Cliente, Novo Veículo, Novo Serviço, Produtos, Estoque, Relatórios, Configurações).
- **Login inicial** (do seed): `admin@nrlubrificantes.com` / `nrlubrificantes123`.

⚠️ Defina `JWT_SECRET` no `.env` antes de rodar — sem ele o login quebra propositalmente (fail-safe).

As rotas para as quais os atalhos e a sidebar apontam (`/clientes`, `/veiculos`, `/servicos`, etc.) ainda não têm páginas — elas chegam nas próximas fases.

## Fase 3 — Clientes + Veículos (concluída)

CRUD real, conectado ao Neon via Prisma — nada mockado:

- **Schema atualizado**: `Veiculo` ganhou `quilometragemAtual` e `fotoUrl` (rode `npx prisma migrate dev --name veiculo_km_foto` depois de puxar esta fase).
- **Upload de imagens**: `app/actions/upload.ts` (Vercel Blob) + `components/shared/image-upload.tsx`, usado tanto no formulário de cliente quanto no de veículo.
- **Validação**: `lib/validations/cliente.ts` e `lib/validations/veiculo.ts` (Zod), únicas fontes de verdade usadas pelos formulários e pelas Server Actions.
- **Clientes**: `app/(dashboard)/clientes/{page,actions}.tsx`, `novo/page.tsx`, `[id]/page.tsx` (detalhe com todos os veículos), `[id]/editar/page.tsx`. Busca instantânea por nome/telefone/placa/modelo via `?q=` (`components/shared/search-bar.tsx`).
- **Veículos**: `app/(dashboard)/veiculos/{page,actions}.tsx`, `novo/page.tsx` (aceita `?clienteId=` vindo do botão "Novo Veículo" do cliente), `[id]/page.tsx` (detalhe com botão "Novo Serviço" e timeline), `[id]/editar/page.tsx`. Filtro por tipo via `?tipo=` (`components/veiculos/veiculos-filters.tsx`).
- **Seletor de cliente** searchável (`components/veiculos/cliente-select.tsx`) usado no formulário de veículo, com modo "travado" quando o cliente já vem definido pela URL.
- **Timeline** (`components/veiculos/timeline.tsx`): histórico completo de serviços do veículo, com óleo, filtros, radiador e outros serviços usados em cada atendimento.
- **Exclusão com confirmação** (`components/shared/confirm-dialog.tsx`, `delete-cliente-button.tsx`, `delete-veiculo-button.tsx`) — excluir cliente também remove veículos e histórico em cascata (definido no schema da Fase 1).
- **Componentes shadcn novos**: `select.tsx`, `textarea.tsx`.

O botão "Novo Serviço" na página do veículo já aponta para `/servicos/novo?veiculoId=...` — essa rota chega na Fase 4.

## Fase 4 — Produtos, Estoque e Ordem de Serviço (concluída)

- **Catálogo de produtos**: `lib/validations/produto.ts`, `lib/data/produtos.ts`, `app/(dashboard)/produtos/{actions,page}.tsx`, `novo/page.tsx`, `[id]/editar/page.tsx`. Categorias de óleo (`OLEO_MOTOR`/`OLEO_CAMBIO`) exibem campos extras de viscosidade e tipo (`Produto.viscosidade`/`Produto.tipoOleo`, adicionados ao schema nesta fase).
- **Estoque**: `lib/data/estoque.ts`, `app/(dashboard)/estoque/{actions,page}.tsx`, `components/estoque/entrada-estoque-dialog.tsx` — entrada manual registra `MovimentoEstoque` e incrementa `Produto.quantidade`; a saída é automática (ver Ordem de Serviço). Alertas de estoque baixo aparecem no dashboard, na página de produtos e na de estoque.
- **Ordem de Serviço** — o núcleo transacional do sistema, em `app/(dashboard)/servicos/`:
  - `actions.ts`: `criarServicoAction` roda tudo em uma `$transaction` — valida estoque disponível, cria o `Servico` com `TrocaOleo`/`ServicoRadiador`/`OutroServico`/`ItemServicoProduto` aninhados, dá baixa no estoque (`MovimentoEstoque` SAÍDA), atualiza `Veiculo.quilometragemAtual` e calcula a `ProximaTroca` (por km ou por data, conforme escolhido). `excluirServicoAction` estorna o estoque. `atualizarServicoAction` edita os campos de cabeçalho (produtos são imutáveis após salvos, por integridade do estoque — use "Duplicar" para refazer os itens).
  - Formulário (`components/servicos/servico-form.tsx`) compõe: `veiculo-select.tsx` (busca cliente+veículo), `produtos-picker.tsx` (adiciona produtos do estoque com preço/estoque em tempo real — óleo e filtros herdam marca/viscosidade/tipo/código do próprio produto), `radiador-fields.tsx`, `outros-servicos-picker.tsx` e `proxima-troca-fields.tsx`.
  - `novo/page.tsx` aceita `?veiculoId=` (vindo do botão da página do veículo) e `?duplicarDe=` (pré-preenche o formulário a partir de um serviço existente).
  - `[id]/page.tsx` é o detalhe (recibo), `[id]/editar/page.tsx` a edição, `[id]/comprovante/page.tsx` a versão imprimível — o botão **Gerar PDF** abre essa página e usa o "Salvar como PDF" do navegador (`window.print()`), sem dependência pesada de geração de PDF no servidor.
  - `components/servicos/servico-actions-menu.tsx` — menu **Editar / Duplicar / Gerar PDF / Abrir WhatsApp**, usado tanto na timeline do veículo quanto na lista geral de serviços e no detalhe.

## Fase 5 — Lembretes, Notificações e Histórico (concluída)

- **Lembretes** (`app/(dashboard)/lembretes/page.tsx`, `lib/data/lembretes.ts`, `components/lembretes/lembretes-bucket.tsx`): agrupa por vencidas / hoje / 7 dias / 15 dias / 30 dias, com busca por nome, telefone ou placa e atalho direto para WhatsApp. Adicionado ao menu lateral.
- **Histórico do veículo**: `components/veiculos/timeline.tsx` já exibia óleo, filtros e outros serviços (Fase 3) e agora inclui o menu de ações (Editar/Duplicar/PDF/WhatsApp) em cada entrada.
- **Dashboard**: o painel de trocas (Fase 2) agora linka para `/lembretes`.

⚠️ Após puxar as Fases 4 e 5, rode `npx prisma migrate dev --name produto_oleo_specs` (novos campos `viscosidade`/`tipoOleo` em `Produto`).

## Fase 6 — Módulo Final (concluída)

- **Configurações da empresa**: `app/(dashboard)/configuracoes/page.tsx` + `components/configuracoes/empresa-form.tsx` — nome, logo, telefone, WhatsApp, endereço e mensagem padrão de lembrete. Somente Administrador edita; Funcionário vê um resumo somente leitura.
- **Usuários e permissões** (admin only): `app/(dashboard)/configuracoes/usuarios/{page,novo,[id]/editar}` + `components/configuracoes/usuario-form.tsx` — CRUD completo, nível de acesso (Administrador/Funcionário), ativar/desativar, impossível excluir o próprio usuário logado.
- **Perfil e senha**: `app/(dashboard)/perfil/page.tsx` — troca de nome/foto e alteração de senha (exige senha atual, com bcrypt).
- **Logs de ações**: model `LogAcao` + `lib/log.ts` (`registrarLog`), chamado por todas as Server Actions que criam/editam/excluem Cliente, Veículo, Produto, Serviço e Usuário. Visualização em `app/(dashboard)/configuracoes/logs/page.tsx`.
- **Backup e restauração**: `lib/backup.ts`, `components/configuracoes/backup-actions.tsx`, `app/(dashboard)/configuracoes/backup/page.tsx`. Exporta um `.json` com clientes, veículos, próximas trocas, fornecedores, produtos e configuração da empresa; a restauração é destrutiva para essas tabelas (exige digitar "RESTAURAR" para confirmar) e **não** afeta histórico de serviços nem usuários.
- **Exportação para Excel**: `lib/xlsx.ts` (SheetJS) + rotas `app/api/exportar/{clientes,produtos,estoque,servicos}/route.ts`, com botão "Exportar Excel" nas respectivas listagens.
- **Autorização por papel**: `requireAdmin()` em `lib/auth.ts`, usado em todas as páginas/actions administrativas — usuário sem permissão é redirecionado para `/dashboard`.
- **Robustez geral**: `app/not-found.tsx` (404), `app/(dashboard)/error.tsx` + `app/global-error.tsx` (error boundaries com "Tentar novamente"), `app/(dashboard)/loading.tsx` (loading global de transição).
- **Redução de duplicação**: `ClienteSelect` e `VeiculoSelect` agora são wrappers finos de `components/shared/searchable-select.tsx`.
- **Acessibilidade**: `aria-label` em todos os botões só-ícone; `role="listbox"/"option"` e `aria-expanded` nos comboboxes.

⚠️ Após puxar a Fase 6, rode `npx prisma migrate dev --name fase6_configuracoes_logs` (novos campos em `ConfiguracaoEmpresa` e o model `LogAcao`).

## Revisão Final — o que foi checado e corrigido

**Corrigido nesta passada:**
- Combobox de Cliente e de Veículo estavam duplicados quase linha a linha → extraídos para `components/shared/searchable-select.tsx`; `cliente-select.tsx` e `veiculo-select.tsx` agora são wrappers finos.
- Acessibilidade: `aria-label` adicionado a todos os botões só-ícone (excluir, editar, notificações, menu mobile, remover produto, menu de ações do serviço, recolher/expandir sidebar, remover foto); `role="listbox"`/`role="option"`/`aria-expanded` nos comboboxes.
- Tratamento de erro: `app/not-found.tsx` (404 com a identidade visual), `app/(dashboard)/error.tsx` e `app/global-error.tsx` (error boundaries com botão "Tentar novamente"), `app/(dashboard)/loading.tsx` (loading global de transição de rota).
- Schema: `ConfiguracaoEmpresa` ganhou `telefone`/`endereco`; novo model `LogAcao` para auditoria (usado pela Fase 6, ver abaixo).
- Confirmado: todo redirect() dentro de Server Actions está fora do bloco `try/catch` (ou re-lança `NEXT_REDIRECT` explicitamente), então nenhum redirecionamento é engolido por engano.
- Confirmado: nenhuma página usa dados mockados — toda tela lê do Neon via Prisma (`lib/data/*.ts`).
- Confirmado: `middleware.ts` protege por padrão todas as rotas exceto `/login` e assets internos — novas rotas (Lembretes, Produtos, Estoque, Serviços) já ficam protegidas automaticamente, sem precisar de allowlist manual.

**Verificado e considerado adequado (sem mudança):**
- Responsividade: grids usam breakpoints `sm/md/lg/xl` consistentes; sidebar vira drawer no mobile; tabelas/listas quebram em cards empilhados abaixo de `md`.
- Cores/tipografia: paleta centralizada em `tailwind.config.ts` (`brand.black`/`brand.yellow`) e `app/globals.css` (tokens `--background`/`--primary` etc.) — nenhuma cor solta hardcoded fora da paleta nos componentes novos.
- Consultas Prisma: listagens usam `select`/`include` restritos ao necessário; buscas usam índices já definidos no schema (`@@index` em nome/telefone/placa/data).

**Fase 6 concluída nesta rodada (o que estava pendente foi todo fechado):**
- Configurações da empresa: `app/(dashboard)/configuracoes/page.tsx` + `components/configuracoes/empresa-form.tsx`.
- Usuários e permissões (admin only): `app/(dashboard)/configuracoes/usuarios/{page,novo,[id]/editar}`.
- Perfil e senha: `app/(dashboard)/perfil/page.tsx`.
- Logs de ações: `lib/log.ts` (`registrarLog`) agora é chamado por todas as Server Actions de Cliente, Veículo, Produto, Serviço e Usuário; visualização em `app/(dashboard)/configuracoes/logs/page.tsx`.
- Backup/restauração: `lib/backup.ts` + `app/(dashboard)/configuracoes/backup/page.tsx` (destrutivo, exige digitar "RESTAURAR").
- Exportação Excel: `lib/xlsx.ts` + `app/api/exportar/{clientes,produtos,estoque,servicos}/route.ts`, com botão nas listagens.
- Autorização por papel: `requireAdmin()` protege todas as telas/actions administrativas.

Detalhes de cada item na seção "Fase 6 — Módulo Final" logo abaixo.

## Pontos que dependem de configuração externa (não é possível resolver por código)

- **Neon**: criar o banco, copiar `DATABASE_URL`/`DIRECT_URL` para `.env` e rodar as migrations pendentes (`quilometragemAtual`/`fotoUrl` em Veículo, `viscosidade`/`tipoOleo` em Produto, `LogAcao` e campos novos em `ConfiguracaoEmpresa`).
- **Vercel**: criar o projeto, conectar o repositório, configurar as variáveis de ambiente (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `BLOB_READ_WRITE_TOKEN`) e habilitar o Vercel Blob para upload de imagens.
- **JWT_SECRET**: precisa ser gerado e mantido em segredo (ex: `openssl rand -base64 32`) — sem ele o login falha propositalmente.
- **WhatsApp**: a integração atual é via link `wa.me` (abre o WhatsApp Web/App do funcionário) — não há envio automático de mensagens; isso exigiria a API oficial do WhatsApp Business, que não foi solicitada nem configurada aqui.
- **Domínio/e-mail transacional**: não implementado (ex: recuperação de senha por e-mail) — o link "Esqueci minha senha" na tela de login ainda não tem uma rota funcional por trás. Para recuperar acesso hoje, um Administrador redefine a senha em Configurações → Usuários.
- **Backup/restauração**: cobre apenas dados de cadastro (clientes, veículos, próximas trocas, fornecedores, produtos) — histórico de serviços e usuários ficam de fora por segurança (não vaza hash de senha) e para não arriscar corromper o histórico já faturado.
- **Edição de serviço**: após salvo, os produtos usados não podem ser alterados na tela de edição (só cabeçalho: data, km, valores, pagamento) — proposital, para não corromper o estoque; use "Duplicar" para refazer os itens.

## Próximas fases (na ordem sugerida)

2. **Login + Dashboard**: tela de autenticação premium (JWT + bcrypt) e o layout do dashboard com os indicadores em tempo real.
3. **Clientes + Veículos**: CRUDs completos, upload de foto (Vercel Blob), histórico e timeline visual por veículo.
4. **Serviços/Trocas**: fluxo de novo atendimento, seleção de produtos do catálogo, cálculo automático da próxima troca, geração de PDF e envio via WhatsApp (link `wa.me`).
5. **Estoque + Financeiro + Relatórios**: entradas/saídas, fluxo de caixa, exportação Excel/PDF, gráficos (recharts).
6. **Diferenciais finais**: busca global instantânea, permissões por papel, backup, configurações.

Cada fase será entregue como código funcional incremental sobre esta base — nada aqui precisa ser refeito depois.
