import { Module } from '@nestjs/common';
import { VideosService } from './services/videos.service';
import { VideosController } from './controllers/videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoEntity } from './entities/video.entity';
import { Comment, CommentEntity } from './entities/comment.entity';
import { Like, LikeEntity } from './entities/like.entity';
import { FileSystemModule } from '../file-system/file-system.module';
import { UserService } from '../user/services/user.service';
import { LikesController } from './controllers/likes.controller';
import { LikesService } from './services/likes.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoEntity },
      { name: Comment.name, schema: CommentEntity },
      { name: Like.name, schema: LikeEntity }
    ]),
    FileSystemModule
  ],
  controllers: [VideosController, LikesController],
  providers: [VideosService, UserService, LikesService],
})
export class VideosModule {}
