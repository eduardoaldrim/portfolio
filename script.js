/* =========================================================
   Portfólio - Eduardo Aldrim
   Cada bloco cuida de uma parte da página:
   1. Tema claro/escuro
   2. Menu no celular
   3. Destaque da seção atual no menu
   4. Projetos: filtro, busca, detalhes e atalho para o contato
   5. Formulário de contato: leitura, validação, erros e envio
   ========================================================= */

"use strict";

// Avisa ao CSS que o JavaScript está ativo (filtro e menu móvel dependem disso)
document.documentElement.classList.add("js");

/* ---------- 1. Tema claro/escuro ---------- */

const botaoTema = document.querySelector(".botao-tema");

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  botaoTema.setAttribute("aria-pressed", String(tema === "escuro"));
}

function lerTemaSalvo() {
  try {
    return localStorage.getItem("tema");
  } catch (erro) {
    return null; // navegador sem acesso ao armazenamento: usa o tema claro
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem("tema", tema);
  } catch (erro) {
    // Sem armazenamento, o tema vale só até recarregar a página
  }
}

aplicarTema(lerTemaSalvo() === "escuro" ? "escuro" : "claro");

botaoTema.addEventListener("click", function () {
  const novoTema = document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro";
  aplicarTema(novoTema);
  salvarTema(novoTema);
});

/* ---------- 2. Menu no celular ---------- */

const botaoMenu = document.querySelector(".botao-menu");
const navegacao = document.querySelector("#navegacao");
const telaLarga = window.matchMedia("(min-width: 761px)");

function definirMenuAberto(aberto) {
  navegacao.classList.toggle("aberta", aberto);
  botaoMenu.setAttribute("aria-expanded", String(aberto));
  botaoMenu.textContent = aberto ? "Fechar" : "Menu";
}

botaoMenu.addEventListener("click", function () {
  const estaAberto = botaoMenu.getAttribute("aria-expanded") === "true";
  definirMenuAberto(!estaAberto);
});

// Escolher uma seção fecha o menu
navegacao.addEventListener("click", function (evento) {
  if (evento.target.closest("a")) {
    definirMenuAberto(false);
  }
});

// Esc fecha o menu e devolve o foco ao botão
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && botaoMenu.getAttribute("aria-expanded") === "true") {
    definirMenuAberto(false);
    botaoMenu.focus();
  }
});

// Ao voltar para tela larga, o menu volta ao estado normal
telaLarga.addEventListener("change", function () {
  definirMenuAberto(false);
});

/* ---------- 3. Destaque da seção atual no menu ---------- */

const linksMenu = navegacao.querySelectorAll("a");

function marcarSecaoAtual(idSecao) {
  linksMenu.forEach(function (link) {
    if (link.getAttribute("href") === "#" + idSecao) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          marcarSecaoAtual(entrada.target.id);
        }
      });
    },
    // A seção conta como "atual" quando cruza a faixa central da tela
    { rootMargin: "-45% 0px -50% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach(function (secao) {
    observador.observe(secao);
  });
}

/* ---------- 4. Projetos ---------- */

const listaProjetos = document.querySelector(".lista-projetos");
const projetos = listaProjetos.querySelectorAll(".projeto");
const campoBusca = document.querySelector("#busca-projetos");
const opcoesFiltro = document.querySelectorAll(".filtro__opcao");
const contagemProjetos = document.querySelector("#contagem-projetos");
const semResultados = document.querySelector(".sem-resultados");
const textoSemResultados = document.querySelector("#sem-resultados-texto");

const NOMES_CATEGORIAS = {
  todos: "todas as categorias",
  ia: "Inteligência Artificial",
  web: "Web",
  aula: "Projetos de aula",
};

let categoriaAtiva = "todos";

// Remove acentos e maiúsculas para a busca encontrar "inteligencia" e "Inteligência"
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function projetoCorresponde(projeto, categoria, termo) {
  const categorias = projeto.dataset.categorias.split(" ");
  const passaCategoria = categoria === "todos" || categorias.includes(categoria);
  const passaBusca = termo === "" || normalizarTexto(projeto.textContent).includes(termo);
  return passaCategoria && passaBusca;
}

function textoQuantidade(quantidade) {
  if (quantidade === 0) return "Nenhum projeto exibido.";
  if (quantidade === 1) return "1 projeto exibido.";
  return quantidade + " projetos exibidos.";
}

function aplicarFiltro() {
  const termo = normalizarTexto(campoBusca.value);
  let visiveis = 0;

  projetos.forEach(function (projeto) {
    const mostrar = projetoCorresponde(projeto, categoriaAtiva, termo);
    projeto.hidden = !mostrar;
    if (mostrar) visiveis++;
  });

  contagemProjetos.textContent = textoQuantidade(visiveis);
  semResultados.hidden = visiveis > 0;

  if (visiveis === 0) {
    const busca = campoBusca.value.trim();
    const categoria = NOMES_CATEGORIAS[categoriaAtiva];
    textoSemResultados.textContent = busca
      ? "Nenhum projeto encontrado para “" + busca + "” em " + categoria + ". Tente outra palavra ou mostre todos os projetos."
      : "Nenhum projeto nesta categoria por enquanto. Escolha outra categoria ou mostre todos os projetos.";
  }
}

function selecionarCategoria(categoria) {
  categoriaAtiva = categoria;
  opcoesFiltro.forEach(function (opcao) {
    opcao.setAttribute("aria-pressed", String(opcao.dataset.filtro === categoria));
  });
  aplicarFiltro();
}

opcoesFiltro.forEach(function (opcao) {
  opcao.addEventListener("click", function () {
    selecionarCategoria(opcao.dataset.filtro);
  });
});

campoBusca.addEventListener("input", aplicarFiltro);

document.querySelector("[data-limpar-filtro]").addEventListener("click", function () {
  campoBusca.value = "";
  selecionarCategoria("todos");
  campoBusca.focus();
});

// Detalhes dos projetos começam fechados (sem JavaScript, ficam sempre visíveis)
document.querySelectorAll(".projeto__alternar").forEach(function (botao) {
  document.getElementById(botao.getAttribute("aria-controls")).hidden = true;
});

// Um único listener na lista atende todos os cards (delegação de eventos)
listaProjetos.addEventListener("click", function (evento) {
  const botaoDetalhes = evento.target.closest(".projeto__alternar");
  if (botaoDetalhes) {
    alternarDetalhes(botaoDetalhes);
    return;
  }

  const linkContato = evento.target.closest("[data-assunto]");
  if (linkContato) {
    prepararContatoSobreProjeto(linkContato.dataset.assunto);
  }
});

function alternarDetalhes(botao) {
  const detalhes = document.getElementById(botao.getAttribute("aria-controls"));
  const abrir = botao.getAttribute("aria-expanded") !== "true";
  detalhes.hidden = !abrir;
  botao.setAttribute("aria-expanded", String(abrir));
  botao.textContent = abrir ? "Ocultar detalhes" : "Mostrar detalhes";
}

// "Conversar sobre o STL" já deixa o formulário com motivo e assunto preenchidos
function prepararContatoSobreProjeto(assunto) {
  campos.motivo.value = "outro";
  atualizarCampoAssunto();
  if (campos.assunto.value.trim() === "") {
    campos.assunto.value = assunto;
  }
}

aplicarFiltro();

/* ---------- 5. Formulário de contato ---------- */

const formulario = document.querySelector("#form-contato");
const botaoEnviar = formulario.querySelector(".botao--enviar");
const statusFormulario = document.querySelector("#form-status");
const resumoErros = formulario.querySelector(".resumo-erros");
const campoAssunto = document.querySelector("#campo-assunto");
const contador = document.querySelector("#mensagem-contador");

const campos = {
  nome: document.querySelector("#nome"),
  email: document.querySelector("#email"),
  motivo: document.querySelector("#motivo"),
  assunto: document.querySelector("#assunto"),
  mensagem: document.querySelector("#mensagem"),
};

// Contrato dos campos: as mesmas regras usadas na validação e no contador
const REGRAS = {
  nome: { rotulo: "Nome", min: 3, max: 80, vazio: "Informe seu nome." },
  email: { rotulo: "E-mail", vazio: "Informe seu e-mail." },
  motivo: { rotulo: "Motivo do contato", vazio: "Escolha o motivo do contato." },
  assunto: { rotulo: "Assunto", min: 5, max: 100, vazio: "Informe o assunto." },
  mensagem: { rotulo: "Mensagem", min: 30, max: 1000, vazio: "Escreva sua mensagem." },
};

const camposUsados = new Set(); // campos que a pessoa já editou
let tentouEnviar = false;
let enviando = false;

// Critério único de contagem: caracteres depois de remover espaços das pontas.
// O contador e a regra de tamanho usam esta mesma função.
function contarCaracteres(texto) {
  return texto.trim().length;
}

/* --- Leitura e normalização dos dados --- */

function lerDados() {
  const dadosFormulario = new FormData(formulario);
  const dados = {
    nome: dadosFormulario.get("nome").trim(),
    email: dadosFormulario.get("email").trim(),
    motivo: dadosFormulario.get("motivo"),
    mensagem: dadosFormulario.get("mensagem").trim(),
  };
  // Campo desabilitado não entra no FormData: o assunto só existe para "Outro"
  if (dadosFormulario.has("assunto")) {
    dados.assunto = dadosFormulario.get("assunto").trim();
  }
  return dados;
}

/* --- Regras de validação (não mexem na tela) --- */

function mensagemDeErro(campo) {
  if (campo.disabled) return ""; // campo que não se aplica não é validado

  const regra = REGRAS[campo.name];
  const tamanho = contarCaracteres(campo.value);

  if (tamanho === 0) return regra.vazio;

  if (campo.type === "email" && campo.validity.typeMismatch) {
    return "Digite um e-mail válido, como nome@exemplo.com.";
  }

  if (regra.min && tamanho < regra.min) {
    return regra.rotulo + " precisa ter pelo menos " + regra.min + " caracteres (agora tem " + tamanho + ").";
  }

  if (regra.max && tamanho > regra.max) {
    return regra.rotulo + " pode ter no máximo " + regra.max + " caracteres (agora tem " + tamanho + ").";
  }

  return "";
}

/* --- Apresentação dos erros --- */

function mostrarErro(campo, mensagem) {
  const elementoErro = document.getElementById(campo.id + "-erro");
  elementoErro.textContent = mensagem;
  elementoErro.hidden = false;
  campo.setAttribute("aria-invalid", "true");
}

function limparErro(campo) {
  const elementoErro = document.getElementById(campo.id + "-erro");
  elementoErro.textContent = "";
  elementoErro.hidden = true;
  campo.removeAttribute("aria-invalid");
}

// Valida um campo, atualiza a tela e informa o resultado ao navegador
function validarCampo(campo) {
  const mensagem = mensagemDeErro(campo);
  campo.setCustomValidity(mensagem); // "" remove o erro registrado

  if (mensagem) {
    mostrarErro(campo, mensagem);
  } else {
    limparErro(campo);
  }
  return mensagem === "";
}

function camposInvalidos() {
  return Object.values(campos).filter(function (campo) {
    return !campo.disabled && campo.getAttribute("aria-invalid") === "true";
  });
}

function atualizarResumoErros() {
  const invalidos = camposInvalidos();
  const lista = resumoErros.querySelector(".resumo-erros__lista");

  resumoErros.hidden = !tentouEnviar || invalidos.length === 0;
  lista.replaceChildren();

  invalidos.forEach(function (campo) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#" + campo.id;
    link.textContent = REGRAS[campo.name].rotulo + ": " + document.getElementById(campo.id + "-erro").textContent;
    item.append(link);
    lista.append(item);
  });

  resumoErros.querySelector(".resumo-erros__titulo").textContent =
    invalidos.length === 1 ? "Corrija 1 campo para enviar:" : "Corrija " + invalidos.length + " campos para enviar:";
}

// Clicar num item do resumo leva o foco direto ao campo
resumoErros.addEventListener("click", function (evento) {
  const link = evento.target.closest("a");
  if (!link) return;
  evento.preventDefault();
  document.querySelector(link.getAttribute("href")).focus();
});

/* --- Contador da mensagem --- */

function atualizarContador() {
  const regra = REGRAS.mensagem;
  const tamanho = contarCaracteres(campos.mensagem.value);
  let texto = tamanho + " de " + regra.max + " caracteres";

  if (tamanho > 0 && tamanho < regra.min) {
    const faltam = regra.min - tamanho;
    texto += faltam === 1 ? ", falta 1 para o mínimo" : ", faltam " + faltam + " para o mínimo";
  }

  contador.textContent = texto;
  contador.classList.toggle("campo__contador--fora", tamanho > 0 && (tamanho < regra.min || tamanho > regra.max));
}

/* --- Regra condicional: assunto só para "Outro" --- */

function atualizarCampoAssunto() {
  const seAplica = campos.motivo.value === "outro";
  campoAssunto.hidden = !seAplica;
  campos.assunto.disabled = !seAplica; // desabilitado: fora da validação e dos dados

  if (!seAplica) {
    campos.assunto.setCustomValidity("");
    limparErro(campos.assunto);
    camposUsados.delete("assunto");
  }
  if (tentouEnviar) atualizarResumoErros();
}

/* --- Estados do formulário: edicao, erro, enviando, sucesso, falha --- */

function definirEstado(estado, detalhe) {
  formulario.dataset.estado = estado;
  enviando = estado === "enviando";
  botaoEnviar.disabled = enviando;
  botaoEnviar.textContent = enviando ? "Enviando..." : "Enviar mensagem";
  formulario.setAttribute("aria-busy", String(enviando));
  statusFormulario.replaceChildren();

  if (estado === "erro") {
    adicionarParagrafo("Não foi possível enviar: " + detalhe + ". Os dados preenchidos foram mantidos.");
  } else if (estado === "enviando") {
    adicionarParagrafo("Enviando sua mensagem...");
  } else if (estado === "sucesso") {
    adicionarParagrafo("Mensagem enviada com sucesso. Como este formulário é uma demonstração, nada foi enviado de verdade.");
    const paragrafo = adicionarParagrafo("Para me mandar esta mensagem agora, ");
    const link = document.createElement("a");
    link.href = "https://wa.me/5571996592109?text=" + encodeURIComponent(detalhe);
    link.rel = "noopener";
    link.textContent = "abra-a no WhatsApp";
    paragrafo.append(link, ".");
  } else if (estado === "falha") {
    adicionarParagrafo("O envio falhou (falha simulada). Seus dados foram mantidos: confira e tente enviar novamente.");
  }
}

function adicionarParagrafo(texto) {
  const paragrafo = document.createElement("p");
  paragrafo.textContent = texto; // textContent: nunca interpreta o texto como HTML
  statusFormulario.append(paragrafo);
  return paragrafo;
}

/* --- Envio de demonstração --- */

// Simula um serviço de envio. Resolve ou rejeita conforme o controle de teste.
function enviarMensagemDemo(dados, resultado) {
  return new Promise(function (resolver, rejeitar) {
    setTimeout(function () {
      if (resultado === "falha") {
        rejeitar(new Error("Falha simulada no envio"));
      } else {
        resolver({ recebidoEm: new Date() });
      }
    }, 1500);
  });
}

function textoParaWhatsApp(dados) {
  const linhas = ["Olá, Eduardo! Sou " + dados.nome + " (" + dados.email + ")."];
  if (dados.assunto) linhas.push("Assunto: " + dados.assunto);
  linhas.push("", dados.mensagem);
  return linhas.join("\n");
}

function limparFormulario() {
  formulario.reset();
  camposUsados.clear();
  tentouEnviar = false;
  Object.values(campos).forEach(function (campo) {
    campo.setCustomValidity("");
    limparErro(campo);
  });
  atualizarCampoAssunto();
  atualizarContador();
  atualizarResumoErros();
}

/* --- Processamento do envio --- */

async function aoEnviar(evento) {
  evento.preventDefault();
  if (enviando) return; // impede envios simultâneos (cliques rápidos ou Enter)

  tentouEnviar = true;
  Object.values(campos).forEach(validarCampo);
  atualizarResumoErros();

  // checkValidity junta as restrições do HTML (required, type="email"...)
  // com as regras registradas por setCustomValidity
  if (!formulario.checkValidity()) {
    const invalidos = camposInvalidos();
    const quantidade = invalidos.length === 1 ? "1 campo precisa de correção" : invalidos.length + " campos precisam de correção";
    definirEstado("erro", quantidade);
    if (invalidos.length > 0) invalidos[0].focus();
    return;
  }

  const dados = lerDados();
  const resultadoEscolhido = formulario.querySelector('input[name="simulacao"]:checked').value;
  definirEstado("enviando");

  try {
    await enviarMensagemDemo(dados, resultadoEscolhido);
    limparFormulario();
    definirEstado("sucesso", textoParaWhatsApp(dados));
  } catch (erro) {
    definirEstado("falha");
  }
}

formulario.addEventListener("submit", aoEnviar);

/* --- Feedback durante a edição --- */

formulario.addEventListener("input", function (evento) {
  const campo = evento.target;

  // Ao voltar a editar, a mensagem de sucesso, falha ou erro anterior sai
  if (formulario.dataset.estado !== "edicao" && !enviando) {
    definirEstado("edicao");
  }

  if (campo === campos.mensagem) atualizarContador();
  if (!(campo.name in REGRAS)) return;

  camposUsados.add(campo.name);

  // Se o campo já mostra erro, atualiza enquanto a pessoa corrige
  if (campo.getAttribute("aria-invalid") === "true") {
    validarCampo(campo);
    if (tentouEnviar) atualizarResumoErros();
  }
});

formulario.addEventListener("change", function (evento) {
  if (evento.target === campos.motivo) atualizarCampoAssunto();
});

// Ao sair de um campo já usado, valida (não mostra erros só por carregar a página)
formulario.addEventListener("focusout", function (evento) {
  const campo = evento.target;
  if (!(campo.name in REGRAS)) return;
  if (camposUsados.has(campo.name) || tentouEnviar) {
    validarCampo(campo);
    if (tentouEnviar) atualizarResumoErros();
  }
});

definirEstado("edicao");
atualizarContador();
