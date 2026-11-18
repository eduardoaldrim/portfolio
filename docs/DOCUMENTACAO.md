# Documentação técnica do portfólio

**Aluno:** Eduardo Aldrim
**Disciplina:** Programação Front-End, UCSAL (Profa. Daniele Virgens)
**Atividade:** Portfólio: implementação, auditoria e defesa técnica

Este documento reúne o diagnóstico, as evidências de antes e depois, as decisões de implementação, a matriz de testes, a revisão do colega e as limitações conhecidas.

---

## 1. Diagnóstico da versão anterior

A versão anterior (entregue na Aula 10) foi aberta no Chrome com DevTools em 360 px, 768 px e 1280 px e com zoom de 200%. Foram registrados seis problemas reais. A ordem de trabalho seguiu o impacto no visitante: primeiro o que fazia o visitante perder dados ou ações, depois o que impedia o uso por leitor de tela, depois navegação e organização.

| #   | Tipo                  | Prioridade | Problema                                                           | Situação  |
| --- | --------------------- | ---------- | ------------------------------------------------------------------ | --------- |
| P1  | Funcional             | Alta       | Formulário sem validação e que descartava nome e e-mail            | Corrigido |
| P2  | Funcional             | Alta       | Botão "Ver projeto" com `href="#"` e projetos sem contexto         | Corrigido |
| P4  | Acessibilidade        | Alta       | Tabela perdia os cabeçalhos de coluna no celular                   | Corrigido |
| P3  | Responsividade        | Média      | No celular, o menu só existia no topo de uma página de 4.533 px    | Corrigido |
| P5  | Organização do código | Média      | Cores repetidas, regra CSS duplicada e documentação dentro do HTML | Corrigido |
| P6  | Acessibilidade        | Média      | Rolagem suave e animações ignoravam "reduzir movimento"            | Corrigido |

### P1. Formulário sem validação e que descartava dados (funcional, alta)

- **Local:** seção Contato, `<form action="https://wa.me/5571996592109" method="get">`.
- **Passos para reproduzir:** abrir a página, ir até Contato e clicar em "Enviar mensagem pelo WhatsApp" com os campos vazios. Repetir preenchendo nome e e-mail.
- **Comportamento atual:** nada era validado. O envio vazio gerava `https://wa.me/5571996592109?nome=&email=&text=` (ver `evidencias/P1-antes-destino-do-envio.txt`). O `wa.me` só lê o parâmetro `text`, então o nome e o e-mail digitados pelo visitante eram descartados sem aviso.
- **Comportamento esperado:** validar os campos, explicar o que corrigir e não perder nenhum dado do visitante.
- **Por que alta:** o visitante acredita que se identificou, mas a informação nunca chega. É o principal canal de contato do portfólio.
- **Correção:** formulário com o contrato de campos da atividade (nome, e-mail, motivo, assunto condicional e mensagem), validação em JavaScript, estados de envio e envio de demonstração. Depois do sucesso, há um link do WhatsApp que leva **todos** os dados no texto da mensagem.
- **Evidência:** antes em `evidencias/P1-antes-destino-do-envio.txt`; depois em `evidencias/T01-envio-vazio.png`, `T09a-falha.png` e `T09b-nova-tentativa-sucesso.png`.

### P2. Link vazio e projetos sem contexto (funcional, alta)

- **Local:** card "Meu primeiro site" (`<a class="botao" href="#">Ver projeto</a>`) e card "Portfólio pessoal" sem nenhuma ação.
- **Passos:** clicar em "Ver projeto".
- **Comportamento atual:** a página volta para o topo. O botão promete algo que não faz. Os cards também não tinham problema abordado, público, contribuição nem imagem.
- **Comportamento esperado:** toda ação faz o que o texto diz; cada projeto explica contexto e contribuição.
- **Correção:** o link falso foi removido. Cada card agora tem imagem, tipo (projetos de aula identificados), tecnologias e o botão "Mostrar detalhes" (`aria-expanded`), que abre problema, público e contribuição. No STL, "Conversar sobre o STL" leva ao formulário já com motivo "Outro" e assunto preenchidos.
- **Evidência:** `evidencias/P2-antes-card-link-vazio.png` e `evidencias/P2-depois-card-com-detalhes.png`.

### P3. Menu inacessível ao rolar no celular (responsividade, média)

- **Local:** cabeçalho (`.cabecalho`) em telas de até 600 px.
- **Passos:** abrir em 360 px e rolar até Contato.
- **Comportamento atual:** a página tinha 4.533 px de altura e o menu só existia no topo. Na seção Contato, o visitante estava 3.420 px abaixo do menu e precisava rolar tudo de volta para trocar de seção.
- **Comportamento esperado:** navegação disponível em qualquer ponto da página.
- **Correção:** cabeçalho fixo e compacto (`position: sticky`) com botão "Menu" que abre e fecha a navegação e informa o estado com `aria-expanded`. O menu fecha com Esc (o foco volta ao botão) e ao escolher uma seção. Também foi usado `scroll-padding-top`, para que âncoras e o foco nunca parem atrás do cabeçalho fixo.
- **Evidência:** `evidencias/P3-antes-celular-no-contato.png` e `evidencias/P3-depois-celular-no-contato.png`; menu aberto em `T11a-menu-movel-aberto.png`.

### P4. Tabela sem cabeçalhos para leitor de tela no celular (acessibilidade, alta)

- **Local:** media query de 600 px, regra `.tabela-habilidades thead { display: none; }`.
- **Passos:** abrir em 360 px e conferir a árvore de acessibilidade (DevTools > Elements > Accessibility) ou usar um leitor de tela.
- **Comportamento atual:** em 1280 px a tabela tinha **3** cabeçalhos de coluna na árvore de acessibilidade; em 360 px tinha **0**. O leitor de tela lia "Intermediário" sem dizer que era o nível de HTML.
- **Comportamento esperado:** a mesma estrutura em qualquer largura.
- **Correção:** o `thead` passou a ser escondido só visualmente (técnica de `clip`) e não com `display: none`. Também foram acrescentados `scope="col"` nos cabeçalhos e um `caption`. Medição depois: **3** cabeçalhos em 360 px.

### P5. Organização do código (organização, média)

- **Local:** `style.css` e `index.html` antigos.
- **Comportamento atual:**
  - cerca de 40 declarações de cor espalhadas (`navy` aparecia em 8 regras diferentes);
  - a regra `.tabela-habilidades td:last-child` aparecia duas vezes (linhas 392 e 403);
  - `button:hover` global alterava qualquer botão da página;
  - o `index.html` terminava com 60 linhas de respostas da Aula 06 dentro de um comentário.
- **Comportamento esperado:** cores centralizadas, uma regra por responsabilidade e documentação fora do código.
- **Correção:** variáveis CSS (ver a refatoração na seção 5), CSS organizado em blocos numerados, estilos de botão por classe e respostas antigas movidas para `docs/historico/`.

### P6. Movimento sem respeitar a preferência do usuário (acessibilidade, média)

- **Local:** `html { scroll-behavior: smooth; }` e `.card:hover { transform: ... }` com `transition`.
- **Passos:** ativar "reduzir movimento" no sistema (ou em DevTools > Rendering > Emulate CSS prefers-reduced-motion) e clicar no menu.
- **Comportamento atual:** a rolagem continuava animada.
- **Correção:** rolagem suave e a animação de desenho da mão só acontecem com `prefers-reduced-motion: no-preference`. Com `reduce`, animações e transições são desligadas. Os cards não se movem mais no hover.

---

## 2. Evidências de antes e depois

| Problema           | Antes                                                                                           | Depois                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| P1 Formulário      | `evidencias/P1-antes-destino-do-envio.txt`                                                      | `evidencias/T01-envio-vazio.png`                                                                                           |
| P2 Projetos        | `evidencias/P2-antes-card-link-vazio.png`                                                       | `evidencias/P2-depois-card-com-detalhes.png`                                                                               |
| P3 Menu no celular | `evidencias/P3-antes-celular-no-contato.png`                                                    | `evidencias/P3-depois-celular-no-contato.png`                                                                              |
| P4 Tabela          | árvore de acessibilidade em 360 px: 0 cabeçalhos de coluna                                      | árvore de acessibilidade em 360 px: 3 cabeçalhos de coluna                                                                 |
| Página inteira     | `evidencias/antes-360px.png`, `antes-768px.png`, `antes-1280px.png`, `antes-1280px-zoom200.png` | `evidencias/depois-360px.png`, `depois-768px.png`, `depois-1280px.png`, `depois-1280px-zoom200.png`, `depois-*-escuro.png` |

---

## 3. Decisões de implementação

### Projetos e filtro

- **Fonte de dados única:** os projetos ficam no HTML. Cada card tem `data-categorias` (por exemplo, `"web aula"`). O JavaScript só lê esses atributos e não guarda nomes ou textos de projetos, então o filtro fica separado dos dados. Sem JavaScript, todos os projetos continuam visíveis; o filtro e o menu móvel só aparecem quando o script marca a página com a classe `js`.
- **Filtro + busca:** os botões de categoria usam `aria-pressed`, e a opção ativa tem cor **e** um ✓, para não depender só da cor. A busca ignora acentos e maiúsculas (`normalizarTexto`).
- **Quantidade e estado vazio:** a contagem fica em `role="status"`, então leitores de tela anunciam o resultado. Sem resultados, aparece uma orientação com o termo buscado e o botão "Mostrar todos os projetos".
- **Delegação de eventos:** um único listener em `.lista-projetos` atende "Mostrar detalhes" e "Conversar sobre o STL" em todos os cards.

### Formulário

- **`novalidate` + JavaScript:** o HTML declara o contrato (`required`, `minlength`, `maxlength`, `type="email"`) e o JavaScript aplica as regras com `trim()`. Cada erro é registrado no navegador com `setCustomValidity(mensagem)`, e `setCustomValidity("")` o limpa quando o valor fica válido. No envio, `checkValidity()` funciona como portão final e junta as restrições nativas (como `typeMismatch` no e-mail) com as regras próprias.
- **Critério único de contagem:** `contarCaracteres(texto)` retorna `texto.trim().length`. A mesma função é usada no contador e na regra de tamanho. Espaços nas pontas não contam como conteúdo, e `.length` é a mesma unidade do `maxlength` do navegador, então os limites nunca se contradizem. O conteúdo interno da mensagem não é alterado: o `trim()` só é aplicado aos dados lidos, não ao campo.
- **Excedente:** `maxlength` impede digitar ou colar além de 80 (nome), 100 (assunto) e 1000 (mensagem). Os testes T04 e T05 documentam o bloqueio. A regra em JavaScript também verifica o máximo, caso alguém remova o atributo pelo DevTools.
- **Assunto condicional:** só aparece com o motivo "Outro". Fora dessa condição, o campo fica `hidden` e `disabled`; campos desabilitados não participam da validação nem entram no `FormData`. Ao trocar de motivo, a mensagem de erro e o estado `aria-invalid` do assunto são limpos.
- **Quando mostrar erros:** nunca ao carregar a página. Um campo é validado ao perder o foco **depois de ter sido editado**, ou depois de uma tentativa de envio. Enquanto o campo mostra erro, ele é revalidado a cada digitação, e o erro some assim que o valor fica válido.
- **Erros acessíveis:** cada campo tem `aria-describedby` apontando para a dica, a mensagem de erro e o contador. Campos com erro recebem `aria-invalid="true"`, borda mais grossa e o texto "Erro:", sem depender só da cor. Na tentativa de envio, aparece um resumo com links para cada campo e o foco vai para o primeiro campo inválido.
- **Estados:** `edicao`, `erro`, `enviando`, `sucesso` e `falha`, guardados em `data-estado` no formulário. Em `enviando`, uma variável de controle (`enviando`) e o botão desabilitado impedem envios simultâneos. As mensagens ficam numa região `role="status"`; não é usado `alert()`.

### Outras decisões

- **Funcionalidades do laboratório DOM:** do laboratório vieram o tema com `aria-pressed`, "Mostrar detalhes" com `aria-expanded` (o mesmo padrão do Mostrar mais/menos), o filtro por categoria, a delegação de eventos e o uso de `textContent`. O cadastro e a remoção de projetos **não** foram trazidos para o portfólio público, porque num portfólio real o visitante não deve poder apagar ou criar projetos. Essas funções foram demonstradas no laboratório.
- **Funcionalidade de autoria:** o item do menu da seção visível fica marcado (`aria-current`, com `IntersectionObserver`). O botão "Conversar sobre o STL" também é de autoria: ele preenche o formulário.
- **Cores em hexadecimal:** a regra de usar só nomes de cores era da Aula 07. Aqui as cores ficam em variáveis, o que permite o tema escuro e o ajuste de contraste. A identidade navy e dourado foi mantida. Todos os pares de texto passam no contraste AA da WCAG (o menor é 5,72:1).
- **Fontes locais:** IBM Plex Sans e IBM Plex Sans Condensed ficam na pasta `fonts/` (licença OFL), então a página não depende de serviços externos.
- **Tema salvo:** o `localStorage` guarda apenas a escolha de tema, dentro de `try/catch`. Se o navegador bloquear o armazenamento, o tema vale só até recarregar.

---

## 4. Como o contato funciona

1. O visitante preenche o formulário. As regras são validadas no navegador, como descrito acima.
2. Com os dados válidos, `aoEnviar` lê e normaliza os dados (`lerDados`) e chama `enviarMensagemDemo(dados, resultado)`.
3. `enviarMensagemDemo` é uma **função assíncrona de demonstração**: devolve uma Promise que, depois de 1,5 s, resolve ou rejeita conforme o controle "Resultado da simulação" (Simular sucesso / Simular falha). Não há sorteio.
4. **Sucesso:** o formulário é limpo e a mensagem informa que **nada foi enviado de verdade**. Um link "abra-a no WhatsApp" abre o WhatsApp do Eduardo já com nome, e-mail, assunto e mensagem no texto.
5. **Falha:** os dados permanecem nos campos, o botão volta a funcionar e a mensagem orienta a tentar de novo.
6. **Canais reais:** WhatsApp (71) 99659-2109 e LinkedIn, visíveis na seção Contato.
7. **Segurança:** não há chaves ou senhas no JavaScript, e todo texto digitado pelo visitante é exibido com `textContent`. A validação no navegador não substitui a validação no servidor de uma aplicação real.

---

## 5. Refatoração explicada: cores espalhadas → variáveis CSS

**Problema anterior.** As cores estavam escritas direto em cerca de 40 declarações (`navy` em 8 regras, `white` em 7, `royalblue` em 4...). Mudar o azul principal exigia caçar cada ocorrência, e um tema escuro exigiria duplicar quase o arquivo inteiro.

**Mudança.** Todas as cores viraram variáveis no bloco `:root` do `style.css` (`--fundo`, `--texto`, `--titulo`, `--link`, `--erro`...). As regras passaram a usar `var(--nome)`. O tema escuro é um único bloco, `:root[data-tema="escuro"]`, que só troca os valores das variáveis. Os botões também ganharam variáveis próprias (`--botao-fundo`, `--botao-texto`), o que eliminou regras de tema escuro que brigavam com as variações `.botao--contorno` por especificidade.

**Por que facilita manutenção e teste.** Uma cor muda em um lugar só. O contraste foi conferido par a par na lista de variáveis (seção 3). O tema escuro é testado só trocando o atributo `data-tema` (T15).

**Organização do JavaScript.** O formulário foi escrito com responsabilidades separadas:

- `lerDados`: leitura e normalização;
- `mensagemDeErro`: regras, sem mexer na tela;
- `mostrarErro` e `limparErro`: apresentação;
- `validarCampo`: liga regra e apresentação;
- `definirEstado`: estados;
- `aoEnviar`: processamento.

Também não há listeners duplicados: cada evento do formulário (`submit`, `input`, `change`, `focusout`) tem um único listener no próprio formulário.

---

## 6. Matriz de testes

Testes executados em 17/11/2026 no Google Chrome, com a mesma versão da página que está no repositório. Os casos T12 a T15 foram acrescentados por mim. **Console:** nenhum erro ou aviso em todos os testes. **Network:** nenhum recurso com falha (fontes, imagens e favicon carregados).

| ID  | Entrada ou ação                                                                     | Resultado esperado                                                                          | Resultado obtido                                                                                                                                                                                                                                                                                                                    | Situação |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| T01 | Tentar enviar tudo vazio.                                                           | Identificar erros, orientar correção e focar o primeiro campo inválido.                     | erros em ['nome', 'email', 'motivo', 'mensagem']; foco em #nome (não coberto pelo topo=True); resumo visível=True; status='Não foi possível enviar: 4 campos precisam de correção. Os dados preenchidos foram mantidos.'                                                                                                            | Aprovado |
| T02 | Nome só com espaços; depois nome com acento, apóstrofo e hífen.                     | Rejeitar espaços; aceitar o nome dentro dos limites.                                        | espaços: 'Informe seu nome.'; 'José D'Ávila-Souza': sem erro                                                                                                                                                                                                                                                                        | Aprovado |
| T03 | E-mail sem @; depois formato válido.                                                | Apontar o formato inválido e remover o erro após correção.                                  | sem @: 'Digite um e-mail válido, como nome@exemplo.com.'; corrigido: erro removido                                                                                                                                                                                                                                                  | Aprovado |
| T04 | Nome com 2, 3, 80 e 81 caracteres úteis.                                            | Aplicar os limites; impedir entrada excedente (documentado: maxlength).                     | 2: erro; 3: aceito; 80: aceito; 81 digitados: campo ficou com 80 (maxlength bloqueia)                                                                                                                                                                                                                                               | Aprovado |
| T05 | Mensagem com 29, 30, 1000 e 1001 caracteres úteis; 29 úteis com espaços nas pontas. | Contador e regras coerentes nos limites; excedente bloqueado.                               | 29: erro / contador '29 de 1000 caracteres, falta 1 para o mínimo'; 30: aceito / contador '30 de 1000 caracteres'; 1000: aceito / contador '1000 de 1000 caracteres'; 1001 colados: campo ficou com 1000 / contador '1000 de 1000 caracteres'; 29 úteis + espaços nas pontas: erro / '29 de 1000 caracteres, falta 1 para o mínimo' | Aprovado |
| T06 | "Outro" com assunto vazio, de 4 e de 5 caracteres.                                  | Exigir assunto e respeitar o limite mínimo.                                                 | assunto visível=True; vazio: erro (foco em #assunto); 4: erro; 5: aceito                                                                                                                                                                                                                                                            | Aprovado |
| T07 | Gerar erro no assunto e trocar para "Projeto freelance"; enviar.                    | Ocultar e retirar o campo da validação e dos dados processados.                             | erro antes da troca=True; depois: oculto=True, desabilitado=True; envio=sucesso; dados enviados=['nome', 'email', 'motivo', 'mensagem']                                                                                                                                                                                             | Aprovado |
| T08 | 5 cliques rápidos em Enviar + 2 Enter durante o processamento.                      | Manter apenas uma operação ativa.                                                           | 5 cliques + 2 Enter: 1 processamento(s); botão durante envio: desabilitado=True, texto='Enviando...'                                                                                                                                                                                                                                | Aprovado |
| T09 | Forçar falha; manter os dados; tentar de novo com sucesso.                          | Preservar os valores e permitir nova tentativa.                                             | 1ª tentativa: falha, dados mantidos=True, botão utilizável=True; 2ª tentativa: sucesso                                                                                                                                                                                                                                              | Aprovado |
| T10 | Forçar sucesso e editar um campo novamente.                                         | Confirmação coerente e retirada do status antigo ao retomar a edição.                       | sucesso mostrado ('nada foi enviado' no texto=True, link WhatsApp=True); ao editar: estado=edicao, status vazio=True                                                                                                                                                                                                                | Aprovado |
| T11 | Teclado (Tab, Enter, Esc), tela de 360 px e zoom de 200%.                           | Manter acesso aos controles, mensagens e conteúdo.                                          | 1º Tab: 'Pular para o conteúdo' → foco em #conteudo; menu: Enter abre (aria-expanded=true) e Esc fecha (aria-expanded=false, foco volta ao botão=True); foco visível: outline solid; 360px: [360, 360]; zoom 200%: [640, 640]; Tab no formulário chega ao #motivo                                                                   | Aprovado |
| T12 | Filtrar Web, trocar para IA pelo teclado e voltar a Todos.                          | Quantidade correta, estado ativo único e nenhum card duplicado.                             | Web: 2 ('2 projetos exibidos.', ativo ['web']); IA pelo teclado: 1 ('1 projeto exibido.'); Todos: 3 de 3 cards ('3 projetos exibidos.')                                                                                                                                                                                             | Aprovado |
| T13 | Categoria IA + busca "CSS" (sem correspondência); clicar em "Mostrar todos".        | Orientação em vez de área vazia; botão restaura a lista.                                    | IA + busca 'CSS': 'Nenhum projeto exibido.', orientação visível=True ('Nenhum projeto encontrado para “CSS” em Inteligência Artific...'); 'Mostrar todos': 3 projetos                                                                                                                                                               | Aprovado |
| T14 | Digitar &lt;b&gt;Teste&lt;/b&gt; na busca e em nome, assunto e mensagem; enviar.    | As tags aparecem como texto; nenhum elemento HTML é criado.                                 | busca mostra o texto literal=True, elementos &lt;b&gt; criados: 0                                                                                                                                                                                                                                                                   | Aprovado |
| T15 | "Conversar sobre o STL", "Mostrar detalhes" e botão de tema.                        | Formulário pré-preenchido; detalhes abrem com aria-expanded; tema alterna com aria-pressed. | STL: motivo='outro', assunto='Sobre o projeto STL'; detalhes: aria-expanded=true, visível=True; tema: escuro (aria-pressed=true)                                                                                                                                                                                                    | Aprovado |

---

## 7. Revisão cruzada

**Revisão por: Cauã de Jesus**
Revisei todo o projeto e realizei testes em dispositivos móveis e computadores, sem identificar falhas no repositório.
Também verifiquei a responsividade e a organização dos elementos em diferentes resoluções.
Durante os testes, não observei comportamentos inesperados que comprometessem a utilização.
Com isso, considero que o projeto está funcionando conforme o esperado nos ambientes avaliados.

## 8. Limitações e melhorias futuras

- O formulário é uma **demonstração**: não existe serviço de envio. Uma melhoria futura é integrar um serviço real (por exemplo, um endpoint próprio ou um serviço de formulários) e validar também no servidor.
- O contador usa `.length`, então alguns emojis contam como 2 caracteres, o mesmo critério do `maxlength` do navegador.
- As imagens dos projetos são ilustrações. Uma melhoria é substituí-las por capturas reais do STL funcionando.
- O card "Meu primeiro site" não tem link porque o projeto não está publicado. Quando estiver, entra um link "Ver projeto" real.
- A revisão cruzada (seção 7) depende do colega e ainda precisa ser feita.
