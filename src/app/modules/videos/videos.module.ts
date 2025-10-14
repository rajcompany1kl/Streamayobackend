import { Module } from '@nestjs/common';
import { VideosService } from './services/videos.service';
import { VideosController } from './controllers/videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoEntity } from './entities/video.entity';
import { Comment, CommentEntity } from './entities/comment.entity';
import { Like, LikeEntity } from './entities/like.entity';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoEntity },
      { name: Comment.name, schema: CommentEntity },
      { name: Like.name, schema: LikeEntity }
    ])
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
