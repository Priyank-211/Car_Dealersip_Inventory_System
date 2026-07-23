import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

let storage;
if (process.env.NODE_ENV === 'test') {
  // Mock storage for tests
  storage = multer.memoryStorage();
} else {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'autovault_vehicles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
  });
}

export const upload = multer({ 
  storage: storage,
  limits: { files: 5 } // Enforce max 5 files at multer level
});
