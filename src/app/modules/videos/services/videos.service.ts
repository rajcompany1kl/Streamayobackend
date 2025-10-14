import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from '../dto/create-video.dto';
import { UpdateVideoDto } from '../dto/update-video.dto';
import { Controller, Post, UploadedFile, UseInterceptors, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideosService {
  create(createVideoDto: CreateVideoDto) {
    
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
  async upload(file: Express.Multer.File) {
    
    if (!file) throw new HttpException('No file uploaded', 400);
    const inputPath = file.path;
    const videoId = Date.now().toString();
    const outputDir = path.join('hls', videoId);
    fs.mkdirSync(outputDir, { recursive: true });

   // ffmpeg command: adaptive HLS (2 variants: 720p & 360p)
   // const safeInput = inputPath.replace(/(["'\s])/g, '\\$1');
   // const safeOutput = outputDir.replace(/(["'\s])/g, '\\$1');

    const cmd = `ffmpeg -y -i "${inputPath.replace(/\\\\/g,'/')}" \
    -preset veryfast -g 48 -sc_threshold 0 \
    -map 0:v -map 0:a? \
    -s:v 1280x720 -b:v 2500k -c:v libx264 \
    -c:a aac -b:a 128k \
    -f hls -hls_time 6 -hls_playlist_type vod \
    -hls_segment_filename "${outputDir.replace(/\\\\/g,'/')}/segment%03d.ts" \
    "${outputDir.replace(/\\\\/g,'/')}/playlist.m3u8"`;


    try {
      await new Promise((resolve, reject) => {
        const p = exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
      // Optionally delete original upload to save space
      try { fs.unlinkSync(inputPath); } catch(e) {}
      return { videoId };
    } catch (e) {
      console.error('ffmpeg error', e);
      throw new HttpException('Encoding failed', 500);
    }
  }

  
}
