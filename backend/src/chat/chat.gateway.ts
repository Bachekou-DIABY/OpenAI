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
  async handleTranslate(client: Socket, payload: {username:string, timeSent:string, content:string, targetLanguage:string}): Promise<void> {
    if (payload.username) {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
          { role: 'system', content: `Traduis moi le message dans la langue ${payload.targetLanguage} sans RIEN y ajouter` },
          { role: 'system', content: `Si la langue demandée est "", ne fais pas la traduction et renvoie exactement le meme` },

          { role: 'user', content: payload.content },
        ],
      });  
      this.server.emit('chat-translate', {
        ...payload,
        content: response.choices[0].message.content,
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
    console.log('client connected ', client.id);
    this.clients.push({
      client,
    });
      client.emit('messages-old', this.chatMessages);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected ', client.id);
    this.clients = this.clients.filter((c) => c.client.id !== client.id);
  }
}
