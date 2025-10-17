import { Body, Controller, Get, Logger, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';


import { Like } from '../entities/like.entity';
import { LikesService } from '../services/likes.service';

  
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

 @Post("video/:videoId/:videoOwnerId")
 public likeVideo(
    @Param('videoId') videoId: string, 
    @Param('videoOwnerId') videoOwnerId: string, 
    @Body('userId') userId: string
  ) {
    try {
      const result = this.likesService.LikeVideo(videoId, userId, videoOwnerId);
      return result
    } catch (error) {
      Logger.error(error)
    }
  }

  @Get(':videoId/:userId')
  public getLikeStatus(
    @Param("userId") userId: string,
    @Param("videoId") videoId: string
  ) {
    try {
      const result = this.likesService.isLiked(videoId, userId)
      return result
    } catch (error) {
      
    }
  }
}
