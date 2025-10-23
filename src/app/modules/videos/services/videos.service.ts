import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, deleteModel, Model, ObjectId } from 'mongoose';
import { ExtendedVideoEntity, Video, VideoDocument } from '../entities/video.entity';
import { HttpException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { Mylist, MylistDocument } from '../entities/mylist.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
     @InjectModel(Mylist.name) private mylistModel: Model<MylistDocument>,
    private readonly userService: UserService
  ) {}

  public async getAllVideos() {
    console.log("get all hit")
    const videos = await this.videoModel.find().lean().exec();

    if (videos.length === 0) {
      return { users: [], videos: [] };
    }
    const userIds = [...new Set(videos.map(video => video.userId))];

    const userPromises = userIds.map(id => this.userService.getUserById(id));
    const users = await Promise.all(userPromises);

    return { users, videos };
  }

  public async getVideoById(id: string): Promise<ExtendedVideoEntity> {
    const video = await this.videoModel.findById(id).exec()
    let user:any
    if(video) {
      user = await this.userService.getUserById(video.userId)
    }

    const responseObj =  {...video, userImageUrl: user.imageUrl, userName: `${user.firstName} ${user.lastName}` } as ExtendedVideoEntity
    return responseObj
  }

  public async getVideoByUserId(userId: string) {
    const videos = this.videoModel.find({ userId: userId }).exec()
    return videos
  }



   public async saveVideo(userId: string, videoId: string, videoOwnerId: string, videoOwnerName: string, videoOwnerUrl: string) {
    console.log(videoOwnerId)
    const existing = await this.mylistModel.findOne({ userId, videoId });

  if (existing) {
    console.log("unsave karra hu")
    await this.mylistModel.deleteOne({ userId, videoId });
    console.log("unsave kar diya")
    return { message: "Video removed from list" };
  }

    const item = new this.mylistModel({
      userId,
      videoId,
      videoOwnerId,
      videoOwnerName,
      videoOwnerUrl
    });

  const savedItem = await item.save();
  const populatedItem = await savedItem.populate('videoId');
  return populatedItem;
  }

   public async isSaved(userId: string, videoId: string) {
    
    const existing = await this.mylistModel.findOne({ userId, videoId });

  if (existing) {
    return true;
  }

  return false;
  } 
  
   public async savedVideos(userId: string) {
   const savedVideos = await this.mylistModel.find({ userId: userId }).populate('videoId').exec()
   let extendedVideos: ExtendedVideoEntity[] = []
   for(let video of savedVideos) {
    const extendedVideo = {...(video.videoId as any), userName: video.videoOwnerName, userImageUrl: video.videoOwnerUrl} as ExtendedVideoEntity
    extendedVideos.push(extendedVideo)
   }
  return extendedVideos;
  }

  public async deleteVideoMetadata(id: string) {
    const deletedVideo = this.videoModel.findByIdAndDelete(id).exec();
    if(!deletedVideo) {
      throw new NotFoundException(`Video with id: ${id} not found!`)
    }
    return deletedVideo
  }
  
  async uploadToCloud( metadata: Video) {
    try {
      console.log(metadata);
      console.log("upload route hit");
      const uploadedMetadata = new this.videoModel(metadata);
    
      console.log(uploadedMetadata)
      return uploadedMetadata.save();
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

}
