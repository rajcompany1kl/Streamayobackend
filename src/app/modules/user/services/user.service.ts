import clerkClient from "@clerk/clerk-sdk-node";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UserService {
    async getUserById(userId: string) {
        try {
          const user = await clerkClient.users.getUser(userId);
          return user;
        } catch (error) {
          console.error('Error fetching user from Clerk:', error);
          throw new NotFoundException(`User with ID '${userId}' not found.`);
        }
      }
}