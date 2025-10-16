import clerkClient from "@clerk/clerk-sdk-node";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Video } from "../../videos/entities/video.entity";

@Injectable()
export class UserService {
    public async getUserById(userId: string) {
        try {
          const user = await clerkClient.users.getUser(userId);
          return user;
        } catch (error) {
          console.error('Error fetching user from Clerk:', error);
          throw new NotFoundException(`User with ID '${userId}' not found.`);
        }
    }

    public async getAllUsers(videos: Video) {
        
    }
}