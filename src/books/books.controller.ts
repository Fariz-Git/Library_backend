import { Controller, Post, Get, Param, Body,Delete, Patch } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() body: any) {
    return this.booksService.create(body);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.booksService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.delete(+id);
  }
}