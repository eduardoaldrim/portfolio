# Portfólio | Eduardo Aldrim

Portfólio pessoal de Eduardo Aldrim, estudante de Engenharia de Software, desenvolvido na disciplina de Programação Front-End da UCSAL. Ele apresenta formação, conhecimentos, projetos (incluindo o STL, tradutor de Libras para português premiado na FENIC e terceiro lugar na FEBRACE) e formas de contato.

**Versão publicada:** https://eduardoaldrim.github.io/portfolio/

## Como abrir

- **Sem instalar nada:** baixe ou clone o repositório e abra o `index.html` no navegador.
- **Publicado:** no GitHub, vá em _Settings > Pages_, escolha a branch `main` e a pasta `/ (root)`. Em alguns minutos o site fica disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Não há dependências externas: fontes, imagens e scripts estão no próprio projeto.

## Funcionalidades

- Layout responsivo testado em 360 px, 768 px, 1280 px e com zoom de 200%.
- Cabeçalho fixo; no celular, menu com botão que informa o estado (`aria-expanded`) e fecha com Esc.
- Tema claro e escuro (`aria-pressed`), que fica salvo no navegador.
- Filtro de projetos por categoria e busca por nome ou tecnologia, com contagem de resultados e orientação quando nada é encontrado.
- Detalhes dos projetos (problema, público e contribuição) com "Mostrar detalhes".
- Formulário de contato com validação completa, campo condicional, contador de caracteres, erros acessíveis e estados de envio (edição, erro, enviando, sucesso e falha).
- Envio **simulado** para demonstração, com controle para escolher sucesso ou falha. Nenhuma mensagem é enviada; o contato real é pelo WhatsApp e pelo LinkedIn.
- Acessibilidade: link para pular ao conteúdo, foco visível, navegação completa por teclado, contraste AA e respeito a "reduzir movimento".

## Estrutura

```
index.html                 Estrutura da página (HTML semântico)
style.css                  Estilos, temas e media queries
script.js                  Interações: tema, menu, filtro e formulário
img/                       Avatar, favicon e imagens dos projetos
fonts/                     IBM Plex Sans e IBM Plex Sans Condensed (licença OFL)
docs/DOCUMENTACAO.md       Diagnóstico, antes/depois, decisões, matriz de testes,
                           revisão do colega, refatoração e funcionamento do contato
docs/evidencias/           Capturas antes/depois e resultados dos testes
docs/historico/            Respostas das atividades anteriores (Aulas 06, 07 e 10)
```

## Documentação

Toda a parte técnica está em [`docs/DOCUMENTACAO.md`](docs/DOCUMENTACAO.md):

1. Diagnóstico de seis problemas da versão anterior
2. Evidências de antes e depois
3. Decisões de implementação
4. Como o contato funciona
5. Refatoração explicada
6. Matriz de testes (T01 a T15)
7. Revisão cruzada
8. Limitações

## Participante

Eduardo Aldrim (trabalho individual).

## Apoios e fontes

- Documentação da MDN sobre Constraint Validation API, `FormData`, ARIA e `IntersectionObserver`.
- Fontes IBM Plex (licença SIL Open Font License, arquivo em `fonts/LICENSE-OFL.txt`).
