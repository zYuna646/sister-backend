import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery } from 'src/common/schemas/gallery.schema';
import { Model } from 'mongoose';

@Injectable()
export class GalleryService extends BaseService<Gallery> {
  constructor(@InjectModel('Gallery') private galleryModel: Model<Gallery>) {
    super(galleryModel);
  }
}
