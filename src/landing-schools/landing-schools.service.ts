import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { LandingSchools } from 'src/common/schemas/landing-schools.schema';
import { Model } from 'mongoose';

@Injectable()
export class LandingSchoolsService extends BaseService<LandingSchools> {
  constructor(
    @InjectModel('LandingSchools')
    private landingSchoolsModel: Model<LandingSchools>,
  ) {
    super(landingSchoolsModel);
  }
}
