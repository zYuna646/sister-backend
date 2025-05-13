import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from 'src/common/base/base.controller'; // Assuming BaseController provides basic CRUD functionality
import { GalleryCategory } from 'src/common/schemas/gallery-category.schema';
import { GalleryCategoryService } from './gallery-category.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/common/guards/permissions/permissions.guard';
import { CreateDtoGalleryCategory } from './dto/create.dto';
import { UpdateDtoGalleryCategory } from './dto/update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Permission } from 'src/common/decorators/permissions.decorator';
import { BaseResponse } from 'src/common/base/base.response';

@Controller('gallery-category')
@ApiBearerAuth()
export class GalleryCategoryController extends BaseController<GalleryCategory> {
  constructor(
    protected readonly galleryCategoryService: GalleryCategoryService,
  ) {
    super(galleryCategoryService);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new gallery category' })
  @ApiBody({ type: CreateDtoGalleryCategory })
  @ApiResponse({
    status: 201,
    description: 'The gallery category has been successfully created.',
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
    @Body() createDto: CreateDtoGalleryCategory,
  ): Promise<BaseResponse<GalleryCategory>> {
    return this.galleryCategoryService.create(createDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all gallery categories' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all gallery categories.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No gallery categories found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(): Promise<BaseResponse<GalleryCategory[]>> {
    return this.galleryCategoryService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a gallery category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the gallery category.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No gallery category found with the given ID.',
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
  ): Promise<BaseResponse<GalleryCategory>> {
    return this.galleryCategoryService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a gallery category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoGalleryCategory })
  @ApiResponse({
    status: 200,
    description: 'The gallery category has been successfully updated.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No gallery category found with the given ID.',
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
    @Body() updateDto: UpdateDtoGalleryCategory,
  ): Promise<BaseResponse<GalleryCategory>> {
    return this.galleryCategoryService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The gallery category has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No gallery category found with the given ID.',
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
  ): Promise<BaseResponse<GalleryCategory>> {
    return this.galleryCategoryService.delete(id);
  }
}
