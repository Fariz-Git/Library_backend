import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow } from './borrow.entity';
import { Student } from '../students/student.entity';
import { Book } from '../books/book.entity';
import { BooksService } from '../books/books.service';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private borrowRepo: Repository<Borrow>,

    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(Book)
    private bookRepo: Repository<Book>,

    private booksService: BooksService,
  ) {}

  async issueBook(studentId: number, bookId: number) {
    const student = await this.studentRepo.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const book = await this.bookRepo.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableQuantity <= 0) {
      throw new BadRequestException('Book not available');
    }

    await this.booksService.decreaseQuantity(bookId);

    const borrow = this.borrowRepo.create({
      student,
      book,
      returned: false,
    });

    return await this.borrowRepo.save(borrow);
  }

  async returnBook(borrowId: number) {
    const borrow = await this.borrowRepo.findOne({
      where: { id: borrowId },
      relations: ['book'],
    });

    if (!borrow) {
      throw new NotFoundException('Borrow record not found');
    }

    if (borrow.returned) {
      throw new BadRequestException('Book already returned');
    }

    borrow.returned = true;

    await this.booksService.increaseQuantity(borrow.book.id);

    return await this.borrowRepo.save(borrow);
  }

  async findAll() {
    return await this.borrowRepo.find({
      relations: ['student', 'book'],
    });
  }
}