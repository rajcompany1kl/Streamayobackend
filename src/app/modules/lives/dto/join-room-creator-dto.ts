// src/live/dto/join-room-creator.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class JoinRoomCreatorDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userImageUrl: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

   @IsString()
  @IsNotEmpty()
  title: string;

   @IsString()
  @IsNotEmpty()
  description: string;

   @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

}