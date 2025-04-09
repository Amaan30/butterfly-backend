import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudinary';
import { Request } from 'express';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'auto',
    folder: 'butterfly_app',
    format: async (req: Request, file: Express.Multer.File) => {
      return file.mimetype.split('/')[1]; // e.g., "jpg", "mp4"
    },
    public_id: (req: Request, file: Express.Multer.File) => {
      return `${Date.now()}-${file.originalname}`;
    }
  } as any // 👈 still required to bypass strict type
});

export const upload = multer({ storage });
