const openChatBtn = document.getElementById('open-chat');
    const closeChatBtn = document.getElementById('close-chat');
    const chatWindowEl = document.getElementById('chat-window');
    const chatMessagesEl = document.getElementById('chat-messages');
    const chatInputEl = document.getElementById('chat-input');

    let chatVisible = false;

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
          addMessage('user', userMessage);

          // Llama a la función getCompletion con el mensaje del usuario
          const response = await getCompletion(userMessage);

          if (response) {
            const botMessage = response.choices[0].text;
            addMessage('bot', botMessage);
          }

          chatInputEl.value = '';
        }
      }
    });

    async function getCompletion(prompt) {
    const API_KEY = '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';
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
            max_tokens: 2000,
          }),
        });

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