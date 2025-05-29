import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateDtoUser } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/common/guards/permissions/permissions.guard';
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from 'src/common/decorators/permissions.decorator';
import { BaseResponse } from 'src/common/base/base.response';
import { User } from 'src/common/schemas/user.schema';
import { Request } from 'express';

@Controller('siswa')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Siswa Management')
export class SiswaController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new siswa' })
  @ApiBody({ type: CreateSiswaDto })
  @ApiResponse({
    status: 201,
    description: 'The siswa has been successfully created.',
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
    @Body() createSiswaDto: CreateSiswaDto,
    @Req() req: Request,
  ): Promise<BaseResponse<User>> {
    return this.userService.createSiswa(createSiswaDto, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all siswa' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all siswa.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Siswa not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(@Req() req: Request): Promise<BaseResponse<User[]>> {
    return this.userService.findAllSiswa(req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a siswa by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the siswa.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Siswa not found.',
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
    @Req() req: Request,
  ): Promise<BaseResponse<User>> {
    return this.userService.findById(id, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a siswa by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoUser })
  @ApiResponse({
    status: 200,
    description: 'The siswa has been successfully updated.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Siswa not found.',
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
    @Body() updateDto: UpdateDtoUser,
    @Req() req: Request,
  ): Promise<BaseResponse<User>> {
    return this.userService.update(id, updateDto, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a siswa by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The siswa has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Siswa not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('DELETE')
  async delete(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<BaseResponse<User>> {
    return this.userService.delete(id, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('upload-photo/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `siswa-photo-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({ summary: 'Upload siswa profile photo' })
  @ApiParam({ name: 'id', type: String, description: 'Siswa ID' })
  @ApiResponse({
    status: 200,
    description: 'Siswa profile photo uploaded successfully.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid file format or size.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Siswa not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('POST')
  async uploadProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<BaseResponse<User>> {
    if (!file) {
      return new BaseResponse<User>(400, 'No file uploaded', null);
    }

    const filePath = `uploads/users/${file.filename}`;
    return this.userService.uploadProfilePhoto(id, filePath, req.query);
  }
}
