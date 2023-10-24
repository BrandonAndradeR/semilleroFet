const API_KEY = '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';
const MAX_REQUESTS_PER_MINUTE = 2000; // Cambia esto según el límite de la API de OpenAI
const WAIT_TIME = 1000 * 60; // 1 minuto en milisegundos

const openChatBtn = document.getElementById('open-chat');
const closeChatBtn = document.getElementById('close-chat');
const chatWindowEl = document.getElementById('chat-window');
const chatMessagesEl = document.getElementById('chat-messages');
const chatInputEl = document.getElementById('chat-input');

let chatVisible = false;
let lastRequestTimestamp = 0;
let requestCount = 0;

function addMessage(sender, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
  messageDiv.textContent = message;
  chatMessagesEl.appendChild(messageDiv);
}

openChatBtn.addEventListener('click', () => {
  chatWindowEl.style.display = 'block';
  chatVisible = true;
});

closeChatBtn.addEventListener('click', () => {
  chatWindowEl.style.display = 'none';
  chatVisible = false;
});

chatInputEl.addEventListener('keyup', async (event) => {
  if (event.key === 'Enter') {
    const userMessage = chatInputEl.value.trim();
    if (userMessage) {
      addMessage('user', "YO: "+userMessage);

      // Llama a la función getCompletionWithRateLimit con el mensaje del usuario
      const response = await getCompletionWithRateLimit(userMessage);

      if (response) {
        const botMessage = response.choices[0].text;
        addMessage('bot', "IA: "+botMessage);
      }

      chatInputEl.value = '';
    }
  }
});

async function getCompletionWithRateLimit(prompt) {
  const currentTime = Date.now();
  if (currentTime - lastRequestTimestamp < WAIT_TIME && requestCount >= MAX_REQUESTS_PER_MINUTE) {
    // Espera un minuto antes de hacer la siguiente solicitud
    const waitTime = WAIT_TIME - (currentTime - lastRequestTimestamp);
    console.log(`Esperando ${waitTime / 1000} segundos antes de la próxima solicitud.`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    lastRequestTimestamp = Date.now();
    requestCount = 0;
  } else if (currentTime - lastRequestTimestamp >= WAIT_TIME) {
    // Reinicia el contador si ha pasado más de un minuto desde la última solicitud
    lastRequestTimestamp = Date.now();
    requestCount = 0;
  }

  try {
    
    const response = await fetch(`https://api.openai.com/v1/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2500,
      }),
    });

    requestCount++; // Incrementa el contador de solicitudes
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error en la respuesta de la API de OpenAI");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
