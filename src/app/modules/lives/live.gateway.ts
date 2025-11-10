import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LiveRoomsService } from './liverooms.service';
import { JoinRoomCreatorDto } from './dto/join-room-creator-dto';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class LiveGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly liveService: LiveRoomsService) {}

  // ===========================
  // 🔹 Creator joins their room
  // ===========================
  @SubscribeMessage('join-room-creator')
  handleJoinRoomCreator(
    @MessageBody() data: JoinRoomCreatorDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log("join request by creator")
    console.log(`[JOIN-ROOM-CREATOR] client=${client.id} room=${data.roomId}`);
    client.join(data.roomId);

    this.liveService.createLiveRoom(
      data.userId,
      data.roomId,
      data.userImageUrl,
      data.userName,
      data.title,
      data.description,
      data.thumbnailUrl,
    );

    console.log('[DB] Live room created');
    console.log(`[EMIT] creator-joined -> ${data.roomId}`);
  }

  // ===========================
  // 🔹 Viewer joins a creator room
  // ===========================
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`[JOIN-ROOM] client=${client.id} room=${roomId}`);
    client.join(roomId);

    // Notify creator that a new viewer joined
    this.server.to(roomId).emit('viewer-joined', { viewerId: client.id });
    console.log(`[EMIT] viewer-joined -> ${roomId} for ${client.id}`);
  }

  // ===========================
  // 🔹 WebRTC signaling relay
  // ===========================
  @SubscribeMessage('signal')
  handleSignal(
    @MessageBody() data: { to: string; signal: any },
    @ConnectedSocket() client: Socket,
  ) {
    // Prevent sending signal to self (avoids feedback loops)
    if (data.to === client.id) {
      console.warn(`[SIGNAL] Ignored self-signal from=${client.id}`);
      return;
    }

    console.log(
      `[SIGNAL] from=${client.id} to=${data.to} type=${data.signal?.type || '(candidate)'}`
    );

    // Forward signal only to intended target
    this.server.to(data.to).emit('signal', {
      from: client.id,
      signal: data.signal,
    });
  }

  // ===========================
  // 🔹 Connection lifecycle
  // ===========================
  handleConnection(client: Socket) {
    console.log(`[CONNECT] client=${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[DISCONNECT] client=${client.id}`);
  }
}
