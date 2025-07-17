### Swagger: Open Source Tool for API Design & Documentation at Scale
Swagger is an open-source tool that helps you design, document, and test REST APIs at scale.
This guide shows how to integrate Swagger with a NestJS application.


## 1.Installation 
To implement Swagger in your REST API, first install the required dependency:

``` ts 
 npm install --save @nestjs/swagger
```

## 2.Implementing Swagger in main.ts

Once the installation is complete, open the main.ts file and initialize Swagger using the SwaggerModule class:

``` ts 

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Users Api')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

``` 
###Note:
SwaggerModule.createDocument() generates the Swagger document based on your app's routes and metadata.
SwaggerModule.setup('api', …) serves the Swagger UI at /api.

Run the following command to start the HTTP server:

```ts
 npm run start

```
Then open your browser and navigate to:

👉 http://localhost:3000/api

Swagger UI will automatically reflect all your endpoints.



## 3.Annotating APIs with Swagger Decorators

### controllers and routes 

Decorate your controllers and routes with appropriate Swagger decorators to group and describe them:


```ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('USERS MGMT')
@Controller('users')
export class UserController {
  @Get()
  findAllUsers(): string {
    return this.userService.findAll();
  }
}
```

###  Defining Data Models

Define your data models using the @ApiProperty() decorator in your DTOs.
This populates the UI schema in Swagger.

```ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '1234567890', required: true })
  phoneNumber: string;
}
```

### Further Description 

Enhance your endpoint documentation with:

✅ @ApiResponse() — to describe response status codes and messages

✅ @ApiBody() — to define the request body schema

Example:

```ts 
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

@ApiTags('USERS MGMT')
@Controller('users')
export class UserController {
  @Post()
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateUserDto,
    description: 'JSON structure for the user object',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    this.userService.create(createUserDto);
  }
}

```


##Notes on RESTful API Design: 

REST is an architectural style for designing networked applications.
It uses standard HTTP methods (GET, POST, PUT, DELETE, etc.) to access and manipulate resources.
These HTTP methods already describe the intent of each endpoint.

🚫 Avoid adding redundant action names like /getUser or /updateUser — instead, use /user with the correct HTTP method.

✅ Examples:

GET /user → fetch users

POST /user → create a user

PUT /user/:id → update a user

Following this convention keeps your API clean, consistent, and RESTful.

