import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { GalleryCategory } from 'src/common/schemas/gallery-category.schema';
import { Model } from 'mongoose';

@Injectable()
export class GalleryCategoryService extends BaseService<GalleryCategory> {
  constructor(
    @InjectModel('GalleryCategory')
    private galleryCategoryModel: Model<GalleryCategory>,
  ) {
    super(galleryCategoryModel);
  }
}
