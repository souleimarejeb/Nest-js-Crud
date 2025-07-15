# 🧩 NestJS Middleware: Verify User Existence

A simple NestJS middleware that checks if a user exists in the database before processing the request.  
Helps prevent operations on non-existent users and improves data integrity.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Implementation Guide](#implementation-guide)
  - [1️⃣ Create the Middleware](#1️⃣-create-the-middleware)
  - [2️⃣ Configure the Middleware](#2️⃣-configure-the-middleware)
- [Running the Project](#-running-the-project)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

This middleware intercepts incoming requests, extracts the user ID (from `params` or `body`), and checks if the user exists by calling the `UsersService`.  
If the user does not exist, it throws a `NotFoundException`.

---

## 📋 Prerequisites

✅ Node.js & npm installed  
✅ NestJS project (v9 or later recommended)  
✅ TypeORM configured  
✅ `UsersService` with a `getOne(id)` method that returns 404 when not found.

---

##  Implementation Guide

### 1.Create the Middleware

Create the file:  
src/middlewares/user-exists.middleware.ts


And add the following code:

```ts
import { NestMiddleware, Logger, Injectable, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/modules/users/users.service";

@Injectable()
export class UserExistsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UserExistsMiddleware.name);

  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(UserExistsMiddleware.name);

    let userId = req.params.id || req.body.id;

    const user = await this.userService.getOne(userId);

    if (user.statusCode === 404) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    next();
  }
}
```
This class implements the NestMiddleware interface and uses the UsersService to verify user existence.

### 2.Configure the Middleware
Open the file:
```ts
Update your `src/modules/users/users.module.ts` to register the middleware.
```

You can specify **where** to apply the middleware by indicating the controller or particular routes,  
and use `.exclude()` to skip specific paths or HTTP methods where the middleware shouldn’t run.

For example, to apply the middleware to all routes in `UsersController` except for `POST /v1/users` (user creation) and `GET /v1/users` (listing users), configure it like this:

```ts

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from 'src/database/models/user.entity';
import { UserExistsMiddleware } from 'src/middlewares/user-exists.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserExistsMiddleware)
      .exclude({ path: '/v1/users', method: RequestMethod.POST }) // exclude create user
      .exclude({ path: '/v1/users', method: RequestMethod.GET })  // exclude list users
      .forRoutes(UsersController);
  }
}

```

### 3.Running the Project
After integrating the middleware, start the project:
```ts
npm run start:dev
``` 

Then test your endpoints:
✅ Requests to invalid or missing user IDs should return:

```ts
404 Not Found
{
  "statusCode": 404,
  "message": "User with ID <id> not found",
  "error": "Not Found"
}
```

### 4. Middleware in Action

This middleware acts as a **gatekeeper** for your user-related routes, ensuring that any operation involving a user ID first verifies the user actually exists in the database.

By doing this, it helps to:  
- Prevent accidental modifications or deletions of non-existent users  
- Improve error handling by returning clear, consistent `404 Not Found` responses  
- Maintain data integrity and application stability  

### Where it works

The middleware seamlessly integrates with your user routes, guarding operations like:  
- Fetching a user’s profile  
- Updating user information  
- Deleting a user record  

Meanwhile, it gracefully skips routes where verifying a user isn’t needed, such as user creation or listing all users.

---


...
