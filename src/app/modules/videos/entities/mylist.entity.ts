import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type MylistDocument = Mylist & Document;

@Schema({ timestamps: true})
export class Mylist {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true })
    videoId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true})
    userId: string;

    @Prop({ required: true})
    videoOwnerId: string;

    @Prop({ required: true})
    videoOwnerName: string;

    @Prop({ required: true})
    videoOwnerUrl: string;

}
export const MylistEntity = SchemaFactory.createForClass(Mylist);