
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Like } from '../entities/like.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtendedVideoEntity, Video } from '../entities/video.entity';
import { UserService } from '../../user/services/user.service';


@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private readonly userService: UserService
  ) { }

  public async LikeVideo(videoId: string, userId: string, videoOwnerId: string) {
    const existingLikeEntity = await this.likeModel.findOne({ videoId, userId, videoOwnerId });
    let increment = 0;
    let updatedDislikes = 0;

    if (!existingLikeEntity) {
      await this.likeModel.create({ videoId, userId, videoOwnerId, status: 'LIKED', isComment: false });
      increment = 1;
    } else if (existingLikeEntity.status === 'DISLIKED') {
      await this.likeModel.updateOne(
        { videoId, userId, videoOwnerId },
        { $set: { status: 'LIKED' } }
      );
      increment = 1;
      updatedDislikes = -1
    } else if(existingLikeEntity?.status === 'LIKED') {
      await this.likeModel.deleteOne({ videoId, userId, videoOwnerId })
      increment = -1
    } else {
      increment = 0;
    }

    const response = await this.videoModel.findByIdAndUpdate(
      videoId,
      { $inc: { likesCount: increment, dislikeCount: updatedDislikes } },
      { new: true }
    );

    if (!response) {
      throw new NotFoundException(`Video with id: ${videoId} not found!`);
    }

    return true;
  }

  public async DislikeVideo(videoId: string, userId: string, videoOwnerId: string) {
    const existingLikeEntity = await this.likeModel.findOne({ videoId, userId, videoOwnerId });
    let increment = 0;
    let updatedLikes = 0;

    if (!existingLikeEntity) {
      await this.likeModel.create({ videoId, userId, videoOwnerId, status: 'DISLIKED', isComment: false });
      increment = -1;
    } else if (existingLikeEntity.status === 'LIKED') {
      await this.likeModel.updateOne(
        { videoId, userId, videoOwnerId },
        { $set: { status: 'DISLIKED' } }
      );
      increment = 1;
      updatedLikes = -1
    } else if(existingLikeEntity.status === 'DISLIKED') {
      await this.likeModel.deleteOne({ videoId, userId, videoOwnerId })
      increment = -1
    } else {
      increment = 0;
    }

    if (increment !== 0) {
      const response = await this.videoModel.findByIdAndUpdate(
        videoId,
        { $inc: { dislikeCount: increment, likesCount: updatedLikes } },
        { new: true }
      );

      if (!response) {
        throw new NotFoundException(`Video with id: ${videoId} not found!`);
      }
    }

    return true;
  }

  public async getLikedVideos(userId: string) {
    const userLikes = await this.likeModel.find({userId, status: 'LIKED'})
    if(userLikes.length <= 0) {
      return []
    }
    const likedVideosId = userLikes.map((likes) => likes.videoId)
    const likedVideosPromises = likedVideosId.map(id => this.videoModel.findById(id))
    const likedVideos = await Promise.all(likedVideosPromises)

    const videoOwnerIds = [...new Set(likedVideos.map(v => v?.userId))]
    const videoOwnerPromises = videoOwnerIds.map(id => {
      if(id) {
        return this.userService.getUserById(id)
      }
    })
    const videoOwners = await Promise.all(videoOwnerPromises) as any[]

    let videos: ExtendedVideoEntity[] = []
    for(let video of likedVideos) {
      const user = videoOwners.find(u => u.id == video?.userId)
      const extendedVideo = {...video as Video, userName: `${user?.firstName} ${user?.lastName ?? " "}`, userImageUrl: user?.hasImage ? user.imageUrl : ""} as ExtendedVideoEntity
      videos.push(extendedVideo)
    }

    return videos
  }

  public async isLiked(videoId: string, userId: string) {
    const like = await this.likeModel.findOne({ videoId, userId }).exec();
    if(like?.status === 'LIKED') {
      return true
    } else if(like?.status === 'DISLIKED') {
      return false
    }
    return null;
  }

} 
