import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { StudentsModule } from './students/students.module';
import { BooksModule } from './books/books.module';
import { BorrowModule } from './borrow/borrow.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database Connection
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // Automatically loads entities
      synchronize: true, // Auto create tables (development only)
    }),

    // Feature Modules
    StudentsModule,
    BooksModule,
    BorrowModule,
  ],
})
export class AppModule {}