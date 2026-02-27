import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , Like} from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async create(data: Partial<Student>) {
    if (!data.name || !data.email || !data.department) {
      throw new BadRequestException('All fields are required');
    }

    const student = this.studentRepo.create(data);
  
    try {
      const savedStudent = await this.studentRepo.save(student);
      return {message : 'Student created successfully', student: savedStudent};

    } catch (error) {
      throw new BadRequestException('Email already exists');
    }
  }

  async findAll(page: number, limit: number ,search : string) {
      
    const whereCondition = search
    ? [
        { name: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
        { department: Like(`%${search}%`) },
      ]
    : {};

    const [data, total] = await this.studentRepo.findAndCount({ 
      where :whereCondition ,
      skip: (page - 1) * limit,
      take: limit,
      order : { id :  `ASC`},
    });
    
    if (!data || data.length === 0) {
      throw new NotFoundException('Student not found');
    }

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }


async update (id: number, data: Partial<Student>) {
  const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.studentRepo.update(id,data);
    return this.studentRepo.findOne({ where: { id } }); 
  }

  async delete (id:number) {
    const student = await this.studentRepo.findOne({ where: { id } });  
    if (!student) {
      throw new NotFoundException('Student not found');
    } 
    await this.studentRepo.delete(id);
    return {message :  `Student with id ${id} has been deleted`};
}
}