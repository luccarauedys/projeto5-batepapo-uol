let username;
let chat = document.getElementById("chat");
carregarMensagensServidor();
perguntarNomeUsuario();

function carregarMensagensServidor() {
  let promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

  promise.then(exibirMensagens);
  promise.catch((err) => {
    console.log(err.response.status);
    alert("Desculpe, houve um erro. Tente novamente mais tarde.");
  });
}

function perguntarNomeUsuario() {
  username = prompt("Qual é o seu nome?");
  username = { name: username };

  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/participants",
    username
  );

  promise.then(manterConexao);
  promise.catch(tentarNovamente);
}

function manterConexao() {
  setInterval(() => {
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", username);
  }, 5000);
}

function tentarNovamente(erro) {
  console.log(erro.response.status);
  alert("Esse nome já está em uso. Por favor, escolha outro.");
  perguntarNomeUsuario();
}

function exibirMensagens(response) {
  chat.innerHTML = "";
  let mensagensChat = response.data;
  let mensagem;

  for (let i = 0; i < mensagensChat.length; i++) {
    let { from, to, text, type, time } = mensagensChat[i];

    if (type !== "status") {
      if (
        type === "message" ||
        (type === "private_message" && to === username.name)
      ) {
        mensagem = `<div class="msg ${type}" data-identifier="message">
      <span>(${time})</span>
      <span> <strong>${from}</strong> para <strong>${to}:</strong> </span>
      <span>${text}</span>
      </div>`;
      }
    } else {
      mensagem = `<div class="msg status" data-identifier="message">
      <span>(${time})</span>
      <span> <strong>${from}</strong> </span>
      <span>${text}</span>
      </div>`;
    }
    chat.innerHTML += mensagem;
    let ultimaMensagem = document.querySelector("#chat div:last-child");
    if (ultimaMensagem != null) {
      ultimaMensagem.scrollIntoView();
    }
  }
}

setInterval(carregarMensagensServidor, 3000);

function enviarMensagem() {
  let input = document.getElementById("writeHere");
  let mensagemDigitada = input.value;
  let mensagemEnviada = {
    from: username.name,
    to: "Todos",
    text: mensagemDigitada,
    type: "message",
  };
  console.log(mensagemEnviada);
  input.value = "";

  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/messages",
    mensagemEnviada
  );

  promise.then(carregarMensagensServidor);
  promise.catch(() => {
    window.location.reload();
  });
}

function enviarComEnter(e) {
  if (e.key === "Enter") {
    enviarMensagem();
  }
}
