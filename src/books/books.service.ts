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
    // return await this.bookRepo.save(book);

    try {
      const savedBook = await this.bookRepo.save (book);
      return {message : 'Book created successfully', book: savedBook};
   }catch (error) {
      throw new BadRequestException('book already exists');
     }

  }   
  

  async findAll(page: number, limit: number) {
    const [data ,total] = await this.bookRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!data || data.length === 0) {
      throw new NotFoundException('Book not found');
    }

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async update (id:number , data :Partial<Book>) {
    const book = await this.bookRepo.findOne({ where: { id } });
    if(!book) {
      throw new NotFoundException('Book not found');
    }

    await this.bookRepo.update(id, data);
    return this.bookRepo.findOne({ where: { id } });
  } 

  async delete(id:number) {
    const book = await this.bookRepo.findOne({ where : { id } });
    if(!book) {
      throw new NotFoundException('Book not found');
  }

    await this.bookRepo.delete(id);
    return {message : `Book with id ${id} has been deleted`};
  }   

  // Decrease Quantity
  async decreaseQuantity(id:number){
    const book = await this.bookRepo.findOne({where : { id } });
    if(!book) {
      throw new NotFoundException('Book not found');
    }   
    if(book.availableQuantity <= 0) {
      throw new BadRequestException('Book not available');
    }
    book.availableQuantity -= 1;
    return this.bookRepo.save(book);    
  }
  
  // Increase Quantity
  async increaseQuantity(id:number){
    const book = await this.bookRepo.findOne({where : { id } });
    if(!book) {
      throw new NotFoundException('Book not found');
    }   
    if(book.availableQuantity >= book.totalQuantity) {
      throw new BadRequestException('Book quantity already full');
    }
    book.availableQuantity += 1;
    return this.bookRepo.save(book);    
  }
}