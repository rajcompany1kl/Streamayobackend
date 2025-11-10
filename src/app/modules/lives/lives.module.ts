import { Module } from '@nestjs/common';
import { LiveRooms, LiveRoomsEntity } from './entities/liverooms.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveGateway } from './live.gateway';
import { LiveRoomsService } from './liverooms.service';
import { LivesController } from './lives.controller';


@Module({
  imports:[
    MongooseModule.forFeature([
      { name: LiveRooms.name, schema: LiveRoomsEntity },
    ]),
  ],
  controllers: [LivesController],
  providers: [LiveGateway, LiveRoomsService],
})
export class LiveRoomsModule {}
