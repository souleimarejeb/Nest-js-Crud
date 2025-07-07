# NestJS CRUD with TypeORM and MySQL

A complete NestJS application with TypeORM integration for MySQL database operations, including CRUD operations, migrations, and seeding.

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## Step-by-Step Setup Guide

### 1. Install Required Packages

Install the necessary dependencies for TypeORM and MySQL:

```bash
npm install @nestjs/typeorm typeorm mysql2 @nestjs/config dotenv
```

**Key packages:**
- `@nestjs/typeorm`: NestJS TypeORM integration
- `typeorm`: ORM library
- `mysql2`: MySQL driver for Node.js
- `@nestjs/config`: Configuration management
- `dotenv`: Environment variable management

### 2. Create Environment Configuration

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following environment variables to your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Note:** Replace `your_username`, `your_password`, and `your_database_name` with your actual MySQL credentials.

### 3. Create Database Configuration

Create the database configuration file at [`src/database/config.ts`](src/database/config.ts):

```typescript
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// ENTITIES
import { UserEntity } from './models/user.entity';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get('DB_PORT'), 10) || 3306,
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    UserEntity,
  ],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: true,
};

export const AppDataSource = new DataSource(dataSourceOptions);
```

### 4. Create Base Entity Model

Create a base entity model at [`src/database/models/base.model.ts`](src/database/models/base.model.ts) for common fields:

```typescript
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ default: true })
  record_status: boolean;

  @Column({ default: '' })
  created_by: string;

  @Column({ default: '' })
  updated_by: string;

  @Column({ default: '' })
  deleted_by: string;

  @Column({ default: '' })
  tenant: string;
}
```

### 5. Create Entity Models

Create your entity models in the [`src/database/models/`](src/database/models/) directory. Example: [`src/database/models/user.entity.ts`](src/database/models/user.entity.ts):

```typescript
import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.model";

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: '250', nullable: true })
  name: string;

  @Column({ type: 'varchar', length: '1250', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: '250', nullable: true })
  email: string;

  @Column({ type: 'varchar', length: '250', nullable: true })
  phone: string;
}
```

### 6. Configure TypeORM in App Module

Update your [`src/modules/app/app.module.ts`](src/modules/app/app.module.ts) to include TypeORM configuration using the `dataSourceOptions`:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { dataSourceOptions } from '../../database/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
```

**Note:** This approach is cleaner as it reuses the `dataSourceOptions` from your database configuration file, avoiding duplication and making the configuration more maintainable.

### 7. Create Service Layer

Create your service files in the [`src/modules/`](src/modules/) directory. Example: [`src/modules/user/user.service.ts`](src/modules/user/user.service.ts):

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
```

### 8. Create Controller Layer

Create your controller files. Example: [`src/modules/user/user.controller.ts`](src/modules/user/user.controller.ts):

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../../database/models/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() userData: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.create(userData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
```

### 9. Create Module Files

Create module files to organize your application. Example: [`src/modules/user/user.module.ts`](src/modules/user/user.module.ts):

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '../../database/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## Project Structure

```
src/
├── database/
│   ├── config.ts              # Database configuration
│   ├── models/
│   │   ├── base.model.ts      # Base entity model
│   │   └── user.entity.ts     # User entity
│   ├── migrations/            # Database migrations
│   └── seeders/              # Database seeders
├── modules/
│   ├── app/
│   │   ├── app.controller.ts  # Main app controller
│   │   ├── app.module.ts      # Main app module
│   │   └── app.service.ts     # Main app service
│   └── user/
│       ├── user.controller.ts # User controller
│       ├── user.module.ts     # User module
│       └── user.service.ts    # User service
└── main.ts                    # Application entry point
```

## API Endpoints

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update user by ID
- `DELETE /users/:id` - Delete user by ID
