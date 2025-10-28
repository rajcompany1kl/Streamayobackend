import { Module } from '@nestjs/common';
import { VideosService } from './services/videos.service';
import { VideosController } from './controllers/videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoEntity } from './entities/video.entity';
import { Comment, CommentEntity } from './entities/comment.entity';
import { Like, LikeEntity } from './entities/like.entity';
import { UserService } from '../user/services/user.service';
import { LikesController } from './controllers/likes.controller';
import { LikesService } from './services/likes.service';
import { Mylist, MylistEntity } from './entities/mylist.entity';
import { Subscription, SubscriptionEntity } from './entities/subscription.entity';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoEntity },
      { name: Comment.name, schema: CommentEntity },
      { name: Like.name, schema: LikeEntity },
      { name: Mylist.name, schema: MylistEntity},
      { name: Subscription.name, schema: SubscriptionEntity },
    ]),
  ],
  controllers: [VideosController, LikesController],
  providers: [VideosService, UserService, LikesService],
})
export class VideosModule {}
