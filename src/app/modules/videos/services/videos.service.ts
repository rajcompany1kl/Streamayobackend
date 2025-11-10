import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, deleteModel, Model, ObjectId } from 'mongoose';
import { ExtendedVideoEntity, Video, VideoDocument } from '../entities/video.entity';
import { HttpException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { Mylist, MylistDocument } from '../entities/mylist.entity';
import { CommentDocument, Comment } from '../entities/comment.entity';
import { Subscription, SubscriptionDocument } from '../entities/subscription.entity';
import { response } from 'express';

@Injectable()
export class VideosService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
     @InjectModel(Mylist.name) private mylistModel: Model<MylistDocument>,
     @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
     @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    private readonly userService: UserService
  ) {}

  public async getAllVideos() {
 
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
    
    const existing = await this.mylistModel.findOne({ userId, videoId });

  if (existing) {
    
    await this.mylistModel.deleteOne({ userId, videoId });
    
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
      const uploadedMetadata = new this.videoModel(metadata);
    
  
      return uploadedMetadata.save();
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  // 🟢 Fetch all comments for a video
public async getComments(videoId: string) {
    
  const comments = await this.commentModel.find({ videoId }).lean().exec();
  if (!comments.length) return [];

  // Attach user info (optional, but useful)
  const userPromises = comments.map((c) =>
    this.userService.getUserById(c.userId)
  );
  const users = await Promise.all(userPromises);

  const enriched = comments.map((c, i) => ({
    ...c,
    userName: `${users[i].firstName} ${users[i].lastName}`,
    userImageUrl: users[i].imageUrl,
  }));

  return enriched;
}

// 🟢 Add a new comment
public async addComment(videoId: string, userId: string, text: string) {
  
  if (!text || text.trim() === '') {
    throw new HttpException('Comment cannot be empty', 400);
  }

  const newComment = new this.commentModel({
    videoId,
    userId,
    text,
  });

  const savedComment = await newComment.save();
  const user = await this.userService.getUserById(userId);

  return {
    ...savedComment.toObject(),
    userName: `${user.firstName} ${user.lastName}`,
    userImageUrl: user.imageUrl,
  };
}comment

// 🟢 Add subscription
public async subscribe(creatorId: string, userId: string, isChecking: boolean) {
 
 const existingSubscription = await this.subscriptionModel.findOne({ creatorId, userId });
 let response = "wait"
 if(isChecking){
   
 if( existingSubscription)
  return response = "true";
else(!existingSubscription)
  return response = "false";
}

if (existingSubscription) {
   await this.subscriptionModel.findOneAndDelete({ creatorId, userId });
    response = "Unsubscribed";
} else {
   const newSubscription = new this.subscriptionModel({
   creatorId, userId
  });

  const savedSubscription = await newSubscription.save();
   response = "Subscribed"
}

  return response;
}

/////// now
 
// 🟢 Add subscription
public async subscribedVids(userId: string) {
 
 const existingSubscriptions = await this.subscriptionModel.find({  userId }).lean().exec();
 let response = "wait"

if (existingSubscriptions && existingSubscriptions.length > 0) {
 const creatorsIds = existingSubscriptions.map((e: any)=> e.creatorId)

    // 2️⃣ Fetch all videos from those creators in one query
 const videos = await this.videoModel
  .find({ userId: { $in: creatorsIds } })
  .sort({ createdAt: -1 }) // newest first
  .limit(10)                // only last 10
  .lean()
  .exec();
  // 3️⃣ Group them by creatorId

  
    
    const creatorPromises = creatorsIds.map(id => {
      if(id) {
        return this.userService.getUserById(id)
      }
    })
    const creators = await Promise.all(creatorPromises) as any[]

    let videosextended: ExtendedVideoEntity[] = []
    for(let video of videos) {
      const user = creators.find(u => u.id == video?.userId)
      const extendedVideo = {...video as Video, userName: `${user?.firstName} ${user?.lastName ?? " "}`, userImageUrl: user?.hasImage ? user.imageUrl : ""} as ExtendedVideoEntity
      videosextended.push(extendedVideo)
    }

  const creatorVideosMap: Record<string, string[]> = {};

  videosextended.forEach((video: any) => {
    const uid = String(video.userId);
    if (!creatorVideosMap[uid]) {
      creatorVideosMap[uid] = [];
    }
    creatorVideosMap[uid].push(video);
  });

  return creatorVideosMap;


} else {
   response = "No Subscriptions"
}
  
  return response;
}


}
