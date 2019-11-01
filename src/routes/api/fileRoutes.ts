import * as express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { filesController } from '../../controllers/filesController';

export const fileRoutes = express.Router();
fileRoutes.post('/file/create', asyncHandler(filesController.insert));
fileRoutes.put('/file/update/:id', asyncHandler(filesController.updateById));
fileRoutes.get('/file/download/:id', asyncHandler(filesController.getDownloadLinkById));
fileRoutes.get('/file/:id', asyncHandler(filesController.getById));
