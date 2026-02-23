import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async create(data: Partial<Book>) {
    if (!data.title || !data.author || !data.totalQuantity) {
      throw new BadRequestException('All fields are required');
    }

    data.availableQuantity = data.totalQuantity;

    const book = this.bookRepo.create(data);
    return await this.bookRepo.save(book);
  }

  async findAll() {
    return await this.bookRepo.find();
  }

  async findOne(id: number) {
    const book = await this.bookRepo.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: number, data: Partial<Book>) {
    await this.findOne(id);

    await this.bookRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.bookRepo.delete(id);

    return { message: 'Book deleted successfully' };
  }

  async decreaseQuantity(id: number) {
    const book = await this.findOne(id);

    if (book.availableQuantity <= 0) {
      throw new BadRequestException('Book not available');
    }

    book.availableQuantity -= 1;
    return this.bookRepo.save(book);
  }

  async increaseQuantity(id: number) {
    const book = await this.findOne(id);

    if (book.availableQuantity >= book.totalQuantity) {
      throw new BadRequestException('Book quantity already full');
    }

    book.availableQuantity += 1;
    return this.bookRepo.save(book);
  }
}

