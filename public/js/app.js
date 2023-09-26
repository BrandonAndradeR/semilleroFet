console.log('js load')


const openChatBtn = document.getElementById('open-chat');
const closeChatBtn = document.getElementById('close-chat'); // Agregamos el botón de cerrar chat

const chatWindowEl = document.getElementById('chat-window');
const chatMessagesEl = document.getElementById('chat-messages');
const chatInputEl = document.getElementById('chat-input');

// Función para agregar un mensaje al chat
function addMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    chatMessagesEl.appendChild(p);
}

// Agregar un listener al botón para abrir el chat
openChatBtn.addEventListener('click', () => {
    chatWindowEl.style.display = 'block';
});

// Agregar un listener al botón para cerrar el chat
closeChatBtn.addEventListener('click', () => {
    chatWindowEl.style.display = 'none';
});


// Agregar un listener al campo de entrada para enviar mensajes
chatInputEl.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const message = chatInputEl.value.trim();
        if (message) {
            addMessage(message);
            chatInputEl.value = '';
        }

        
    }
});
  
  