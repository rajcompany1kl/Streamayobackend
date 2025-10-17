import { Body, Controller, Get, Logger, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Video } from '../entities/video.entity';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}
 
  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadFile(
    @UploadedFile() video: Express.Multer.File, 
    @Body() metadata: Video
  ) {
    try {
      const uploadedVideo = this.videosService.upload(video, metadata);
      return uploadedVideo
    } catch (error) {
      Logger.error(error)
    }
  }

  @Get()
  getAllVideos() {
    try {
      const response = this.videosService.getAllVideos()
      return response
    } catch (error) {
      Logger.error(error)
    }
  }

  @Get(":id")
  getVideoUsingId(
    @Param("id") id: string
  ) {
    try {
      return this.videosService.getVideoById(id)
    } catch (error) {
      Logger.error(error)
    }
  }

  @Get("user/:userId")
  getVideosByUserId(
    @Param('userId') userId: string
  ) {
    try {
      const videos = this.videosService.getVideoByUserId(userId)
      return videos
    } catch (error) {
      Logger.error(error)
    }
  }
}
