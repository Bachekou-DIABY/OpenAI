import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import OpenAI from 'openai';

interface IMessage {
  username: string;
  content: string;
  timeSent: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Socket;

  clients: { client: Socket; username?: string }[] = [];
  chatMessages: IMessage[] = [];
  openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  @SubscribeMessage('chat-message')
  handleChatMessage(client: Socket, payload: IMessage): void {
    const c = this.clients.find((c) => c.client.id === client.id);
    if (c.username) {

      this.server.emit('chat-message', {
        ...payload,
        username: c.username,
      });
      this.chatMessages.push({
        ...payload,
        username: c.username,
      });
    }
  }

  @SubscribeMessage('chat-translate')
  async handleTranslate(client: Socket, payload: { username: string, timeSent: string, content: string, targetLanguage: string }): Promise<void> {
    if (payload.username && payload.targetLanguage !== "") {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
          { role: 'user', content: `Translate the following text to ${payload.targetLanguage} without adding any extra words: ${payload.content}` },
        ],
      });
  
      const translatedContent = response.choices[0].message.content;
  
      const isNonRecognizedLanguage = translatedContent.toLowerCase() === payload.targetLanguage.toLowerCase();
  
      const finalContent = isNonRecognizedLanguage ? payload.content : translatedContent;
  
      this.server.emit('chat-translate', {
        ...payload,
        content: finalContent,
      });
    }
  }

  @SubscribeMessage('chat-verify')
  async handleVerify(client: Socket, payload: { username: string, content: string, timeSent:string }): Promise<void> {
    if (payload.username && payload.content !== "") {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0.1,
        messages: [
          { role: 'user', content: `Veuillez vérifier la déclaration suivante : ${payload.content} Dites-moi si cette déclaration est vraie ou fausse.`},
        ],
      });
      this.server.emit('chat-verify', {
        ...payload,
        content: response.choices[0].message.content
      });
    }
  }

  @SubscribeMessage('chat-suggestions')
  async handleSuggestion(client: Socket, payload: { username: string, messages: string }): Promise<void> {
    if (payload.username && payload.messages !== "") {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0.1,
        messages: [
          { role: 'user', content: `Retourne moi 3 suggestions de réponses en 3 mots en fonction des trois messages suivant : 
          ${payload.messages[0]},
          ${payload.messages[1]},
          ${payload.messages[2]}`
        },
        ],
      });
      const suggestions = response.choices[0].message.content
      .split('\n')
      .map((suggestion: string) => suggestion.trim().replace(/^\d+\./, ''));
        
      this.server.emit('chat-suggestions', {
        ...payload,
        content: suggestions,
      });
    }
  }
  
  @SubscribeMessage('username-set')
  handleUsernameSet(client: Socket, payload: any): void {
    const c = this.clients.find((c) => c.client.id === client.id);
    if (c) {
      c.username = payload.username;
    }
  }

  handleConnection(client: Socket) {
    this.clients.push({
      client,
    });
      client.emit('messages-old', this.chatMessages);
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter((c) => c.client.id !== client.id);
  }
}
