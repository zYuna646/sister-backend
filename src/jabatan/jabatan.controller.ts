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
} from '@nestjs/common';
import { JabatanService } from './jabatan.service';
import { CreateDtoJabatan } from './dto/create.dto';
import { UpdateDtoJabatan } from './dto/update.dto';
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
  ApiQuery,
} from '@nestjs/swagger';
import { Permission } from 'src/common/decorators/permissions.decorator';
import { BaseResponse } from 'src/common/base/base.response';
import { Jabatan } from 'src/common/schemas/jabatan.schema';
import { Request } from 'express';

@Controller('jabatan')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Jabatan Management')
export class JabatanController {
  constructor(private readonly jabatanService: JabatanService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new jabatan' })
  @ApiBody({ type: CreateDtoJabatan })
  @ApiResponse({
    status: 201,
    description: 'The jabatan has been successfully created.',
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
    @Body() createDto: CreateDtoJabatan,
    @Req() req: Request,
  ): Promise<BaseResponse<Jabatan>> {
    return this.jabatanService.create(createDto, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all jabatan' })
  @ApiQuery({
    name: 'parent_only',
    required: false,
    description: 'Filter to get only parent jabatan',
    example: 'true',
  })
  @ApiQuery({
    name: 'is_active',
    required: false,
    description: 'Filter by active status',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all jabatan.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Jabatan not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(@Req() req: Request): Promise<BaseResponse<Jabatan[]>> {
    return this.jabatanService.findAll(req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get('hierarchy')
  @ApiOperation({ summary: 'Get jabatan hierarchy' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved jabatan hierarchy.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async getHierarchy(@Req() req: Request): Promise<BaseResponse<any[]>> {
    return this.jabatanService.getHierarchy(req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id/children')
  @ApiOperation({ summary: 'Get children jabatan by parent ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved children jabatan.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Jabatan not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async getChildren(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<BaseResponse<Jabatan[]>> {
    return this.jabatanService.getChildren(id, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a jabatan by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the jabatan.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Jabatan not found.',
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
  ): Promise<BaseResponse<Jabatan>> {
    return this.jabatanService.findById(id, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a jabatan by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoJabatan })
  @ApiResponse({
    status: 200,
    description: 'The jabatan has been successfully updated.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Jabatan not found.',
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
    @Body() updateDto: UpdateDtoJabatan,
    @Req() req: Request,
  ): Promise<BaseResponse<Jabatan>> {
    return this.jabatanService.update(id, updateDto, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a jabatan by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The jabatan has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Jabatan not found.',
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
  ): Promise<BaseResponse<Jabatan>> {
    return this.jabatanService.delete(id, req.query);
  }
}
