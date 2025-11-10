// src/schemas/video.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LiveRoomsDocument = LiveRooms & Document;

@Schema({ timestamps: true })
export class LiveRooms {
   @Prop({ required: false })
   title: string;

   @Prop({ required: false })
   description: string;

//   @Prop({ required: false })
//   url: string;
 
   @Prop({ required: false })
   thumbnailUrl: string;

  @Prop({ required: true })
  userId: string;

   @Prop({ required: true })
   roomId: string;

   @Prop({ required: true })
 userImageUrl: string;

   @Prop({ required: true })
  userName: string;


//   @Prop({ type: Number, default: 0 })
//   likesCount: number;

//   @Prop({ type: Number, default: 0 })
//   dislikeCount: number;

//   @Prop({ type: Number, default: 0 })
//   commentsCount: number;

}



export const LiveRoomsEntity = SchemaFactory.createForClass(LiveRooms);
