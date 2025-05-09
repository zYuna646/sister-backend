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
import { NewsCategory } from 'src/common/schemas/news-category.schema';
import { NewsCategoryService } from './news-category.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/common/guards/permissions/permissions.guard';
import { CreateDtoNewsCategory } from './dto/create.dto';
import { UpdateDtoNewsCategory } from './dto/update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Permission } from 'src/common/decorators/permissions.decorator';
import { BaseResponse } from 'src/common/base/base.response';

@Controller('news-category')
@ApiBearerAuth()
export class NewsCategoryController extends BaseController<NewsCategory> {
  constructor(protected readonly newsCategoryService: NewsCategoryService) {
    super(newsCategoryService);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new news category' })
  @ApiBody({ type: CreateDtoNewsCategory })
  @ApiResponse({
    status: 201,
    description: 'The news category has been successfully created.',
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
    @Body() createDto: CreateDtoNewsCategory,
  ): Promise<BaseResponse<NewsCategory>> {
    return this.newsCategoryService.create(createDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all news categories' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all news categories.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No news categories found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(): Promise<BaseResponse<NewsCategory[]>> {
    return this.newsCategoryService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a news category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the news category.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No news category found with the given ID.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findById(@Param('id') id: string): Promise<BaseResponse<NewsCategory>> {
    return this.newsCategoryService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a news category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoNewsCategory })
  @ApiResponse({
    status: 200,
    description: 'The news category has been successfully updated.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No news category found with the given ID.',
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
    @Body() updateDto: UpdateDtoNewsCategory,
  ): Promise<BaseResponse<NewsCategory>> {
    return this.newsCategoryService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a news category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The news category has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No news category found with the given ID.',
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
  ): Promise<BaseResponse<NewsCategory>> {
    return this.newsCategoryService.delete(id);
  }
}
