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
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseController } from 'src/common/base/base.controller';
import { News } from 'src/common/schemas/news.schema';
import { NewsService } from './news.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/common/guards/permissions/permissions.guard';
import { CreateDtoNews } from './dto/create.dto';
import { UpdateDtoNews } from './dto/update.dto';
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

@Controller('news')
@ApiBearerAuth()
export class NewsController extends BaseController<News> {
  constructor(protected readonly newsService: NewsService) {
    super(newsService);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('upload-thumbnail/:id')
  @ApiOperation({ summary: 'Upload thumbnail for a news article' })
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
    description: 'The thumbnail has been successfully uploaded.',
    type: BaseResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/news',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(
            null,
            `thumbnail-${randomName}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  @Permission('PUT')
  async uploadThumbnail(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponse<News>> {
    const updateDto: UpdateDtoNews = {
      thumbnail: `uploads/news/${file.filename}`,
    };
    return this.newsService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('create')
  @ApiOperation({
    summary: 'Create a new news article without thumbnail upload',
  })
  @ApiBody({ type: CreateDtoNews })
  @ApiResponse({
    status: 201,
    description: 'The news article has been successfully created.',
    type: BaseResponse,
  })
  @Permission('POST')
  async create(
    @Body() createDto: CreateDtoNews,
    @Request() req,
  ): Promise<BaseResponse<News>> {
    return this.newsService.create(createDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new news article with thumbnail upload' })
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
        summary: { type: 'string' },
        content: { type: 'string' },
        is_featured: { type: 'boolean' },
        publish_date: { type: 'string', format: 'date-time' },
        is_published: { type: 'boolean' },
        category_id: { type: 'string' },
        school_id: { type: 'string' },
        author_id: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The news article has been successfully created.',
    type: BaseResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/news',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(
            null,
            `thumbnail-${randomName}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  @Permission('POST')
  async uploadAndCreate(
    @Body() createDto: CreateDtoNews,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<BaseResponse<News>> {
    // If file is uploaded, add the file path to DTO
    if (file) {
      createDto.thumbnail = `uploads/news/${file.filename}`;
    }

    return this.newsService.create(createDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all news articles' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all news articles.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(): Promise<BaseResponse<News[]>> {
    return this.newsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a news article by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the news article.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findById(@Param('id') id: string): Promise<BaseResponse<News>> {
    return this.newsService.findById(id);
  }

  // Public endpoint to get a news by ID without authentication
  @Get('public/:id')
  @ApiOperation({ summary: 'Get a news article by ID (public)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the news article.',
    type: BaseResponse,
  })
  async findPublicById(@Param('id') id: string): Promise<BaseResponse<News>> {
    // Increment the view count when accessed via public endpoint
    const news = await this.newsService.findById(id);

    if (news.data) {
      const updateDto: UpdateDtoNews = {
        view_count: (news.data.view_count || 0) + 1,
      };
      return this.newsService.update(id, updateDto);
    }

    return news;
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a news article by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoNews })
  @ApiResponse({
    status: 200,
    description: 'The news article has been successfully updated.',
    type: BaseResponse,
  })
  @Permission('PUT')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDtoNews,
    @Request() req,
  ): Promise<BaseResponse<News>> {
    return this.newsService.update(id, updateDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a news article by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The news article has been successfully deleted.',
    type: BaseResponse,
  })
  @Permission('DELETE')
  async softDelete(@Param('id') id: string): Promise<BaseResponse<News>> {
    return this.newsService.delete(id);
  }
}
