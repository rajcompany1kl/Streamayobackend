import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LiveRooms, LiveRoomsDocument } from './entities/liverooms.entity';


@Injectable()
export class LiveRoomsService {
  constructor(
     @InjectModel(LiveRooms.name) private liveRoomsModel: Model<LiveRoomsDocument>,
  ) {} 

  public async getAllLiveRooms() {
    console.log("get all hit")
    const liveRooms = await this.liveRoomsModel.find().lean().exec();

    if (liveRooms.length === 0) {
      return { liveRooms: [] };
    }
    

    return { liveRooms };
  }

    public async createLiveRoom(userId: string, roomId: string, userImageUrl: string, userName: string, title: string, description: string, thumbnailUrl: string) {
      const newLiveRoom = new this.liveRoomsModel({
        userId,
        roomId,
        userImageUrl,
        userName,
        title,
        description,
        thumbnailUrl
      });
      await newLiveRoom.save();
      console.log("Live room created in DB");
    }

    public async endLiveRoom(roomId: string) {
      const deletedRoom = await this.liveRoomsModel.find({ roomId }).exec();
      await this.liveRoomsModel.deleteOne({ roomId }).exec();
      return deletedRoom;
    }

    public async getRoomMetadata(roomId: string) {
      const roomMetadata = await this.liveRoomsModel.find({ roomId }).exec();
      return roomMetadata;
    }
}
