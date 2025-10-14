// src/schemas/comment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true }) 
  userId: string; // Clerk user ID, who commented

  @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
  videoId: Types.ObjectId;

  @Prop({ required: false })
  videoOwnerId: string;
}

export const CommentEntity = SchemaFactory.createForClass(Comment);
