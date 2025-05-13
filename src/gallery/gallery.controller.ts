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
import { BaseController } from 'src/common/base/base.controller';
import { Gallery } from 'src/common/schemas/gallery.schema';
import { GalleryService } from './gallery.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/common/guards/permissions/permissions.guard';
import { CreateDtoGallery } from './dto/create.dto';
import { UpdateDtoGallery } from './dto/update.dto';
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

@Controller('gallery')
@ApiBearerAuth()
export class GalleryController extends BaseController<Gallery> {
  constructor(protected readonly galleryService: GalleryService) {
    super(galleryService);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new gallery item with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        description: { type: 'string' },
        category_id: { type: 'string' },
        school_id: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The gallery item has been successfully created.',
    type: BaseResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/gallery',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Permission('POST')
  async uploadAndCreate(
    @Body() createDto: CreateDtoGallery,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponse<Gallery>> {
    // Create the complete DTO with the file path
    const galleryDto: CreateDtoGallery = {
      ...createDto,
      image_path: `uploads/gallery/${file.filename}`,
    };

    return this.galleryService.create(galleryDto);
  }

  // Keep the original create method to satisfy BaseController
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new gallery item without file upload' })
  @ApiBody({ type: CreateDtoGallery })
  @ApiResponse({
    status: 201,
    description: 'The gallery item has been successfully created.',
    type: BaseResponse,
  })
  @Permission('POST')
  async create(
    @Body() createDto: CreateDtoGallery,
  ): Promise<BaseResponse<Gallery>> {
    return this.galleryService.create(createDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all gallery items' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all gallery items.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No gallery items found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(): Promise<BaseResponse<Gallery[]>> {
    return this.galleryService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a gallery item by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the gallery item.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No gallery item found with the given ID.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findById(@Param('id') id: string): Promise<BaseResponse<Gallery>> {
    return this.galleryService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Update a gallery item by ID with optional image upload',
  })
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
        title: { type: 'string' },
        description: { type: 'string' },
        category_id: { type: 'string' },
        school_id: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The gallery item has been successfully updated.',
    type: BaseResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/gallery',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Permission('PUT')
  async updateWithFile(
    @Param('id') id: string,
    @Body() updateDto: UpdateDtoGallery,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponse<Gallery>> {
    // If file is uploaded, add the file path to DTO
    if (file) {
      updateDto.image_path = `uploads/gallery/${file.filename}`;
    }

    return this.galleryService.update(id, updateDto);
  }

  // Keep the original update method to satisfy BaseController
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put('update/:id')
  @ApiOperation({ summary: 'Update a gallery item by ID without file upload' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoGallery })
  @ApiResponse({
    status: 200,
    description: 'The gallery item has been successfully updated.',
    type: BaseResponse,
  })
  @Permission('PUT')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDtoGallery,
  ): Promise<BaseResponse<Gallery>> {
    return this.galleryService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery item by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The gallery item has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No gallery item found with the given ID.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('DELETE')
  async softDelete(@Param('id') id: string): Promise<BaseResponse<Gallery>> {
    return this.galleryService.delete(id);
  }
}
