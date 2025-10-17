import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { Comment, CommentEntity } from './entities/comment.entity';
import { Like, LikeEntity } from './entities/like.entity';

import { UserService } from '../user/services/user.service';
import { LikesController } from './controllers/likes.controller';
import { LikesService } from './services/likes.services';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentEntity },
      { name: Like.name, schema: LikeEntity }
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService, UserService],
})
export class LikesModule {}
