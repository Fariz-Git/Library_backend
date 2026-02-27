import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository ,Like } from 'typeorm';
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

  // Issue Book
  async issueBook(studentId: number, bookId: number) {
    const student = await this.studentRepo.findOne({
      where: { id: studentId },
    });

    if (!student)
      throw new NotFoundException('Student not found');

    const book = await this.bookRepo.findOne({
      where: { id: bookId },
    });

    if (!book)
      throw new NotFoundException('Book not found');

    if (book.availableQuantity <= 0)
      throw new BadRequestException('Book not available');

    await this.booksService.decreaseQuantity(bookId);

    const borrow = this.borrowRepo.create({
      student,
      book,
      returned: false,
    });

    return this.borrowRepo.save(borrow);
  }

  // Return Book
  async returnBook(borrowId: number) {
    const borrow = await this.borrowRepo.findOne({
      where: { id: borrowId },
      relations: ['book'],
    });

    if (!borrow)
      throw new NotFoundException('Borrow record not found');

    if (borrow.returned)
      throw new BadRequestException(
        'Book already returned',
      );

    borrow.returned = true;

    await this.booksService.increaseQuantity(
      borrow.book.id,
    );

    return this.borrowRepo.save(borrow);
  }

  // Pagination
async findAll(page: number, limit: number, search: string) {
  const query = this.borrowRepo
    .createQueryBuilder('borrow')
    .leftJoinAndSelect('borrow.student', 'student')
    .leftJoinAndSelect('borrow.book', 'book');

  if (search && search.trim() !== '') {
    query.where(
      'LOWER(student.name) LIKE :search OR LOWER(book.title) LIKE :search',
      { search: `%${search}%`.toLowerCase() },
    );
  }

  query
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy('borrow.id', 'DESC');

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  };
}
}