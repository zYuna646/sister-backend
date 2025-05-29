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
import { ClassroomService } from './classroom.service';
import { CreateDtoClassroom } from './dto/create.dto';
import { UpdateDtoClassroom } from './dto/update.dto';
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
import { Classroom } from 'src/common/schemas/classroom.schema';
import { User } from 'src/common/schemas/user.schema';
import { Request } from 'express';

@Controller('classroom')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Classroom Management')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new classroom' })
  @ApiBody({ type: CreateDtoClassroom })
  @ApiResponse({
    status: 201,
    description: 'The classroom has been successfully created.',
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
    @Body() createDto: CreateDtoClassroom,
    @Req() req: Request,
  ): Promise<BaseResponse<Classroom>> {
    return this.classroomService.create(createDto, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get all classrooms' })
  @ApiQuery({
    name: 'guru_id',
    required: false,
    description: 'Filter by guru ID',
    example: '60d21b2f9e3fbd6d6c98e6b0',
  })
  @ApiQuery({
    name: 'grade',
    required: false,
    description: 'Filter by grade',
    example: '7',
  })
  @ApiQuery({
    name: 'is_active',
    required: false,
    description: 'Filter by active status',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all classrooms.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Classrooms not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async findAll(@Req() req: Request): Promise<BaseResponse<Classroom[]>> {
    return this.classroomService.findAll(req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id/students')
  @ApiOperation({ summary: 'Get students in a classroom' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved students in classroom.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('GET')
  async getStudentsInClassroom(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<BaseResponse<User[]>> {
    return this.classroomService.getStudentsInClassroom(id, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post(':classroomId/assign/:studentId')
  @ApiOperation({ summary: 'Assign student to classroom' })
  @ApiParam({ name: 'classroomId', type: String })
  @ApiParam({ name: 'studentId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Student successfully assigned to classroom.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom or student not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('POST')
  async assignStudentToClassroom(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
  ): Promise<BaseResponse<User>> {
    return this.classroomService.assignStudentToClassroom(
      studentId,
      classroomId,
    );
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':classroomId/remove/:studentId')
  @ApiOperation({ summary: 'Remove student from classroom' })
  @ApiParam({ name: 'classroomId', type: String })
  @ApiParam({ name: 'studentId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Student successfully removed from classroom.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: BaseResponse,
  })
  @Permission('DELETE')
  async removeStudentFromClassroom(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
  ): Promise<BaseResponse<User>> {
    return this.classroomService.removeStudentFromClassroom(
      studentId,
      classroomId,
    );
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a classroom by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the classroom.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom not found.',
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
  ): Promise<BaseResponse<Classroom>> {
    return this.classroomService.findById(id, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a classroom by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDtoClassroom })
  @ApiResponse({
    status: 200,
    description: 'The classroom has been successfully updated.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom not found.',
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
    @Body() updateDto: UpdateDtoClassroom,
    @Req() req: Request,
  ): Promise<BaseResponse<Classroom>> {
    return this.classroomService.update(id, updateDto, req.query);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a classroom by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The classroom has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom not found.',
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
  ): Promise<BaseResponse<Classroom>> {
    return this.classroomService.delete(id, req.query);
  }
}
