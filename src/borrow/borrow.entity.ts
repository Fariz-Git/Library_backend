import { Entity,PrimaryGeneratedColumn, ManyToOne,JoinColumn,
  Column} from 'typeorm';
import { Student } from '../students/student.entity';
import { Book } from '../books/book.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ default: false })
  returned: boolean;
}