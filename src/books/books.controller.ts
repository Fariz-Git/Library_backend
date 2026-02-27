import {Controller,Get,Post,Patch,Delete,
  Body,Param,Query,} from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
  ) {}

  @Post()
  create(@Body() body) {
    return this.booksService.create(body);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.booksService.findAll(
      Number(page),
      Number(limit),
      search,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() body,
  ) {
    return this.booksService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.booksService.delete(id);
  }
}
