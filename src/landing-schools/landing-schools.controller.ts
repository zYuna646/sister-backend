import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseController } from 'src/common/base/base.controller'; // Assuming BaseController provides basic CRUD functionality
import { LandingSchools } from 'src/common/schemas/landing-schools.schema';
import { LandingSchoolsService } from './landing-schools.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/common/guards/permissions/permissions.guard';
import { CreateDtoLandingSchools } from './dto/create.dto';
import { UpdateDtoLandingSchools } from './dto/update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Permission } from 'src/common/decorators/permissions.decorator';
import { BaseResponse } from 'src/common/base/base.response';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('landing-schools')
@ApiBearerAuth()
export class LandingSchoolsController extends BaseController<LandingSchools> {
  constructor(protected readonly landingSchoolsService: LandingSchoolsService) {
    super(landingSchoolsService);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('upload-principal-photo/:id')
  @ApiOperation({ summary: 'Upload principal photo for a landing school' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The principal photo has been successfully uploaded.',
    type: BaseResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/landing-schools',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(
            null,
            `principal-${randomName}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  @Permission('PUT')
  async uploadPrincipalPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponse<LandingSchools>> {
    const updateDto: UpdateDtoLandingSchools = {
      principal_photo: `uploads/landing-schools/${file.filename}`,
    };
    return this.landingSchoolsService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('upload-hero-image/:id')
  @ApiOperation({ summary: 'Upload hero image for a landing school' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The hero image has been successfully uploaded.',
    type: BaseResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/landing-schools',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `hero-${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Permission('PUT')
  async uploadHeroImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponse<LandingSchools>> {
    const updateDto: UpdateDtoLandingSchools = {
      hero_image: `uploads/landing-schools/${file.filename}`,
    };
    return this.landingSchoolsService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new landing-schools' })
  @ApiBody({ type: CreateDtoLandingSchools })
  @ApiResponse({
    status: 201,
    description: 'The landing-schools has been successfully created.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('POST')
  async create(
    @Body() createDto: CreateDtoLandingSchools,
  ): Promise<BaseResponse<LandingSchools>> {
    return this.landingSchoolsService.create(createDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all landing-schoolss' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all landing-schoolss.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No landing-schoolss found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(): Promise<BaseResponse<LandingSchools[]>> {
    return this.landingSchoolsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a landing-schools by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the landing-schools.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No landing-schools found with the given ID.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findById(
    @Param('id') id: string,
  ): Promise<BaseResponse<LandingSchools>> {
    return this.landingSchoolsService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a landing-schools by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoLandingSchools })
  @ApiResponse({
    status: 200,
    description: 'The landing-schools has been successfully updated.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No landing-schools found with the given ID.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('PUT')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDtoLandingSchools,
  ): Promise<BaseResponse<LandingSchools>> {
    return this.landingSchoolsService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a landing-schools by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The landing-schools has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No landing-schools found with the given ID.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('DELETE')
  async softDelete(
    @Param('id') id: string,
  ): Promise<BaseResponse<LandingSchools>> {
    return this.landingSchoolsService.delete(id);
  }
}
