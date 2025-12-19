/**
 * Service to communicate with the n8n webhook.
 */

// TODO: Replace this with the actual Webhook URL from the user
const WEBHOOK_URL = 'https://n8n.automatizacionro.work/webhook/n8n_chat';

export const sendMessageToWebhook = async (message, history = [], sessionId) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: message,
        history: history,
        sessionId: sessionId // Unique ID for the conversation
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", text);
      // Throw a descriptive error that will be shown in the chat
      throw new Error(`Respuesta inválida del servidor (JSON malformado). Esto suele pasar si el texto en n8n contiene comillas sin escapar. Inicio de la respuesta: ${text.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error('Error sending message to webhook:', error);
    // For demo purposes, if it fails (e.g. 404 on placeholder), we might want to simulate a response
    // or just rethrow. Let's rethrow for now so the UI can handle it.
    throw error;
  }
};
