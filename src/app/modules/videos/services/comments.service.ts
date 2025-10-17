
import { Injectable,NotFoundException } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from '../entities/video.entity';


@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>
     , @InjectModel(Video.name) private videoModel: Model<Video>
  
  ) {}
 ////////////////////////////////
  public async addComment(videoId: string, userId: string, text: string) {
    const comment = await this.commentModel.create({ videoId, userId, text });

    const res = await this.videoModel.findByIdAndUpdate(videoId, { $inc: { commentsCount: 1 } }, { new: true });
    if (!res) {
      throw new NotFoundException(`Video with id: ${videoId} not found!`);
    }
    return comment;
  } 
} 