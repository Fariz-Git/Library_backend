import { Controller, Post, Get, Param, Body,Delete, Patch, Query,ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() body: any) {
    return this.booksService.create(body);
  }

  //pagination
  @Get()
  findAll(
    @Query(`page`) page = 1,
    @Query(`limit`) limit = 10,
  ) {
    return this.booksService.findAll(+page,+limit);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.booksService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.delete(id);
  }
}