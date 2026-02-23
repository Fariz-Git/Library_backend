import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BorrowService } from './borrow.service';

@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post('issue')
  issue(@Body() body: any) {
    return this.borrowService.issueBook(body.studentId, body.bookId);
  }

  @Post('return/:id')
  returnBook(@Param('id') id: string) {
    return this.borrowService.returnBook(+id);
  }

  @Get()
  findAll() {
    return this.borrowService.findAll();
  }
}