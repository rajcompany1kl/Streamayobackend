// src/schemas/like.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true })
  userId: string; // Clerk user ID, who liked

  @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
  videoId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  commentId: Types.ObjectId | null;  // for likes on comments

  @Prop({ type: Boolean, default: false })
  isComment: boolean; // true = like, false = dislike (optional)

  @Prop({ required: false })
  videoOwnerId: string;
}

export const LikeEntity = SchemaFactory.createForClass(Like);
