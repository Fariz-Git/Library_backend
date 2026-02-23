import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { Borrow } from './borrow.entity';
import { BooksModule } from '../books/books.module';
import { Student } from '../students/student.entity';
import { Book } from '../books/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow, Student, Book]),
    BooksModule,
  ],
  providers: [BorrowService],
  controllers: [BorrowController],
})
export class BorrowModule {}