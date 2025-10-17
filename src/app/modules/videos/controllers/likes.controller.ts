import { Body, Controller, Get, Logger, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';


import { Like } from '../entities/like.entity';
import { LikesService } from '../services/likes.services';

  
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

 @Post("video/:videoId/:videoOwnerId")
 likeVideo(@Param('videoId') videoId: string, @Param('videoOwnerId') videoOwnerId: string, @Body('userId') userId: string)
  {
    try {
      const result = this.likesService.LikeVideo(videoId, userId, videoOwnerId);
      return result
    } catch (error) {
      Logger.error(error)
    }
  }
}
