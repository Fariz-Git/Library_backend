import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      return await this.studentRepo.save(student);
    } catch (error) {
      throw new BadRequestException('Email already exists');
    }
  }

  async findAll() {
    return await this.studentRepo.find();
  }

  async findOne(id: number) {
    const student = await this.studentRepo.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async update(id: number, data: Partial<Student>) {
    const student = await this.findOne(id);

    await this.studentRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number) {
    const student = await this.findOne(id);
    await this.studentRepo.delete(id);

    return { message: 'Student deleted successfully' };
  }
}