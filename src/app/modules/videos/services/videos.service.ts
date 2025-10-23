import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, deleteModel, Model, ObjectId } from 'mongoose';
import { ExtendedVideoEntity, Video, VideoDocument } from '../entities/video.entity';
import { HttpException } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
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
    const hlsDir = path.join(process.cwd(), 'hls');

    if (!fs.existsSync(hlsDir)) {
      return { users: [], videos: [] };
    }
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

  public createCommand(
    inputPath: string,
    outputDir: string
  ) {
    return `ffmpeg -y -i "${inputPath.replace(/\\\\/g,'/')}" \
    -vf "scale=3840:2160" \
    -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 128k \
    -g 120 -sc_threshold 0 -hls_list_size 0 -hls_flags delete_segments \
    -hls_time 4 -hls_playlist_type vod \
    -hls_segment_filename "${outputDir.replace(/\\\\/g,'/')}/segment_%05d.ts" \
    "${outputDir.replace(/\\\\/g,'/')}/playlist.m3u8"`
  }

  public generateThumbnailCommand(
    inputPath: string,
    outputDir: string
  ) {
    return `ffmpeg -i ${inputPath} -ss 00:00:05 -vframes 1 ${outputDir}`
  }

  async upload(file: Express.Multer.File, metadata: Video) {
    if (!file) throw new HttpException('No file uploaded', 400);
    const inputPath = file.path;

    try {
      const uploadedMetadata = new this.videoModel(metadata)
      console.log("upload route hit");
      const videoId = (uploadedMetadata._id as ObjectId).toString()
      const outputDir = path.join('hls', videoId);

      const extension = ".png"
      const thumbnailEndpoint = `${videoId}-${uploadedMetadata.title.replaceAll(" ","_").toLowerCase()}`;
      const thumbnailOutputDir = path.join('thumbnails',thumbnailEndpoint)

      fs.mkdirSync(outputDir, { recursive: true });
  
      const cmd = this.createCommand(inputPath,outputDir);
      const createTnCmd = this.generateThumbnailCommand(inputPath,thumbnailOutputDir+extension)

      const url = `http://localhost:8080/hls/${uploadedMetadata._id}/playlist.m3u8`
      const thumbnailUrl = `http://localhost:8080/thumbnails/${thumbnailEndpoint}${extension}`
      
      uploadedMetadata.set('url',url)
      uploadedMetadata.set('thumbnailUrl',thumbnailUrl)
      
      await new Promise((resolve, reject) => {
        exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
      await new Promise((resolve, reject) => {
        exec(createTnCmd, { maxBuffer: 1024 * 1024 * 50 }, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
      console.log("yha")
      fs.unlinkSync(inputPath)
      return uploadedMetadata.save();
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }
}
