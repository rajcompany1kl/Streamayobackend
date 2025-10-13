import { Module } from '@nestjs/common';
import { VideosService } from './services/videos.service';
import { VideosController } from './controllers/videos.controller';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
