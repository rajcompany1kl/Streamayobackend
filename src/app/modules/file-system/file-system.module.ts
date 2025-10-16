import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(mp4|mov|avi)$/)) {
            return cb(new Error('Unsupported file type!'), false);
          }
          cb(null, true);
        },
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = join(process.cwd(), 'hls');
            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [MulterModule],
})
export class FileSystemModule {}