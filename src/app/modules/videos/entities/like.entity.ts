// src/schemas/like.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDocument = Like & Document;
export type LikeStatus = 'LIKED' | 'DISLIKED';

@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
  videoId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  commentId: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false })
  isComment: boolean;

  @Prop({
    type: String, 
    enum: ['LIKED', 'DISLIKED'],
    default: null,
  })
  status: LikeStatus | null;

  @Prop({ required: false })
  videoOwnerId: string;
}

export const LikeEntity = SchemaFactory.createForClass(Like);
