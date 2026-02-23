import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Student } from '../students/student.entity';
import { Book } from '../books/book.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Book)
  book: Book;

  @Column({ default: false })
  returned: boolean;
}
