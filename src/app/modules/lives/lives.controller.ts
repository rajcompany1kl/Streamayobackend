import { Controller, Get, Param, Post } from "@nestjs/common";
import { LiveRoomsService } from "./liverooms.service";

@Controller('lives')
export class LivesController {
  constructor(private readonly liveService: LiveRoomsService) { }

  @Get("getallrooms")
  async getAllLives() {
    try {
      const response = await this.liveService.getAllLiveRooms()
      console.log("saare lives:", response)
      return response
    } catch (error) {
      console.log(error)
    }
  }

  @Get("room-metadata/:roomId")
  async getRoomMetadata(@Param("roomId") roomId: string) {
    console.log("dhuwidnbwjdiwdbiqwdbw-----------------------")
    try {
      console.log("Fetching metadata for roomId:", roomId)
      const response = await this.liveService.getRoomMetadata(roomId)
      console.log("Room metadata:", response)
      return response
    } catch (error) {
      console.log(error)
    }
  }

  @Post("endroom/:roomId")
  async endRoom(@Param("roomId") roomId: string) {
    try {
      const response = await this.liveService.endLiveRoom(roomId)
      console.log("Room ended:", response)
      return response
    } catch (error) {
      console.log(error)
    }
  }
}