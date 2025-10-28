import { Body, Controller, Get, Logger, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Video } from '../entities/video.entity';
import { v2 as cloudinary } from 'cloudinary';
import { MyListDto } from '../dto/my-list-add.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}
 
  @Get()
  getAllVideos() {
    try {
      const response = this.videosService.getAllVideos()
      return response
    } catch (error) {
      Logger.error(error)
    }
  }

  @Get("mylist/:userId")
  savedVideos(
    @Param('userId') userId: string
  ){
    try {
      return this.videosService.savedVideos(userId)
    } catch (error) {
      Logger.error(error)
    }
  }

  @Post("save/:videoId/:userId")
  saveVideo(
    @Param('videoId') videoId: string,
    @Param('userId') userId: string,
    @Body('videoOwnerDetails') videoOwnerDetails: MyListDto
  ) {
    try {
     return this.videosService.saveVideo(userId, videoId, videoOwnerDetails.videoOwnerId, videoOwnerDetails.videoOwnerName, videoOwnerDetails.videoOwnerUrl)
    } catch (error) {
      Logger.error(error)
    }
  }

  @Get("subscribe/:creatorId/:userId/:checking")
  subscribe(
    @Param('creatorId') creatorId: string,
    @Param('userId') userId: string,
    @Param('checking') checking: string,
  ) {
    try {
      const isChecking = checking === 'true';
      console.log('checking',checking)
     return this.videosService.subscribe( creatorId, userId, isChecking)
    } catch (error) {
      Logger.error(error)
    }
  }
  
   @Get("subscribed-vids/:userId")
  subscribedVids(
    @Param('userId') userId: string,
  ) {
    try {
    
     return this.videosService.subscribedVids(userId)
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

  @Get("save-status/:videoId/:userId")
  getSaveStatus(
    @Param('videoId') videoId: string,
    @Param('userId') userId: string
  ){
      try {
      const res = this.videosService.isSaved(userId, videoId)
      return res
    } catch (error) {
      Logger.error(error)
    }
  }

    @Get('upload-signature')
  getUploadSignature() {
    const timestamp = Math.floor(Date.now() / 1000);
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error('CLOUDINARY_API_SECRET is not defined');
    }
    const signature = cloudinary.utils.api_sign_request(
      { timestamp,
        folder: "videos"
       },
      process.env.CLOUDINARY_API_SECRET
    );

    return { signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME };
  }

  @Post('cloud/upload')
  uploadToCloud(
  @Body() metadata: any
  ){
     try {
      const uploadedVideo = this.videosService.uploadToCloud(metadata);
      return uploadedVideo
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

   // 🟢 Get all comments for a video
  @Get('comments/:videoId')
  async getComments(@Param('videoId') videoId: string) {
    return this.videosService.getComments(videoId);
  }

  // 🟢 Add a comment to a video
  @Post('add-comment/:videoId/:userId')
  async addComment(
    @Param('videoId') videoId: string,
    @Param('userId') userId: string,
    @Body() body: { text: string }
  ) {
    return this.videosService.addComment(videoId, userId, body.text);
  }
}
 