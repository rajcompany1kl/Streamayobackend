// src/schemas/like.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;


@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  creatorId: string;
}

export const SubscriptionEntity = SchemaFactory.createForClass(Subscription);
