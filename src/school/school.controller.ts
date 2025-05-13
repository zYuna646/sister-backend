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
  Query,
} from '@nestjs/common';
import { BaseController } from 'src/common/base/base.controller'; // Assuming BaseController provides basic CRUD functionality
import { School } from 'src/common/schemas/school.schema';
import { SchoolService } from './school.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/common/guards/permissions/permissions.guard';
import { CreateDtoSchool } from './dto/create.dto';
import { UpdateDtoSchool } from './dto/update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { Permission } from 'src/common/decorators/permissions.decorator';
import { BaseResponse } from 'src/common/base/base.response';
import { Request } from 'express';

@Controller('school')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class SchoolController extends BaseController<School> {
  constructor(protected readonly schoolService: SchoolService) {
    super(schoolService);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new school' })
  @ApiBody({ type: CreateDtoSchool })
  @ApiResponse({
    status: 201,
    description: 'The school has been successfully created.',
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
    @Body() createDto: CreateDtoSchool,
    @Req() req: Request,
  ): Promise<BaseResponse<School>> {
    return this.schoolService.create(createDto, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all schools.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No schools found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(@Req() req: Request): Promise<BaseResponse<School[]>> {
    return this.schoolService.findAll(req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get('api-key')
  @ApiOperation({ summary: 'Get a school by API key (authenticated)' })
  @ApiQuery({
    name: 'key',
    description: 'The API key of the school',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the school.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No school found with the given API key.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findByApiKey(
    @Query('key') apiKey: string,
  ): Promise<BaseResponse<School>> {
    return this.schoolService.findByApiKey(apiKey);
  }

  @Get('public/api-key')
  @ApiOperation({ summary: 'Get a school by API key (public)' })
  @ApiQuery({
    name: 'key',
    description: 'The API key of the school',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the school.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No school found with the given API key.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  async findByApiKeyPublic(
    @Query('key') apiKey: string,
  ): Promise<BaseResponse<School>> {
    return this.schoolService.findByApiKey(apiKey);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a school by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the school.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No school found with the given ID.',
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
  ): Promise<BaseResponse<School>> {
    return this.schoolService.findById(id, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a school by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoSchool })
  @ApiResponse({
    status: 200,
    description: 'The school has been successfully updated.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No school found with the given ID.',
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
    @Body() updateDto: UpdateDtoSchool,
    @Req() req: Request,
  ): Promise<BaseResponse<School>> {
    return this.schoolService.update(id, updateDto, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a school by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The school has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No school found with the given ID.',
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
    @Req() req: Request,
  ): Promise<BaseResponse<School>> {
    return this.schoolService.delete(id, req.query);
  }
}
