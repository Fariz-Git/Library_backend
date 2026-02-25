import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() body: any) {
    return this.studentsService.create(body);
  }

  //pagination 
  @Get()
  findAll(
    @Query(`page`) page = 1,
    @Query(`limit`) limit = 10,
  ) {
    return this.studentsService.findAll(+page, +limit);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.studentsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.delete(id);
  }
}