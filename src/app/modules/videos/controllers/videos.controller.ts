import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpException  } from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { CreateVideoDto } from '../dto/create-video.dto';
import { UpdateVideoDto } from '../dto/update-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }
 
  @Post('upload')
   @UseInterceptors(FileInterceptor('video', {
    storage: diskStorage({ 
      destination: './uploads',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    }) 
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
   return this.videosService.upload(file);
  }


  @Get()
  getAllVideos() {
    const hlsDir = path.join(process.cwd(), 'hls');

    if (!fs.existsSync(hlsDir)) {
      return [];
    }

    // Read all folders in hls directory
    const videos = fs.readdirSync(hlsDir)
      .filter((file) => fs.statSync(path.join(hlsDir, file)).isDirectory())
      .map((videoId) => ({
        videoId,
        playlist: `http://localhost:5001/hls/${videoId}/playlist.m3u8`,
      }));

    return videos;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
