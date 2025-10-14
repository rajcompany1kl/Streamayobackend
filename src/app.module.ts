import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './app/modules/videos/videos.module';
import { DatabaseModule } from './app/modules/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), VideosModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
