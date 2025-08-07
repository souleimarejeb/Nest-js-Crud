# Exception Filters Implementation in NestJS

Exception Filters in NestJS provide a centralized mechanism for handling exceptions thrown during the lifecycle of an HTTP request.

Think of them as **NestJS’s version of a global `try/catch`**, integrated into the framework, capable of catching unhandled exceptions thrown from controllers, services, pipes, guards, or interceptors.

---

## 1. Create a Global Exception Filter

Create a new file at:

`common/filters/all-exceptions.filter.ts`

```ts
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || 'Unexpected error';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(
            `${request.method} ${request.url} ${status} error:{ ${message} } `
        );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
```
### Note 
The @Catch() decorator without parameters makes this filter a global handler for all exception types.


## 2. Registering  Exception Filter 

There are multiple ways to register an exception filter in NestJS. Here are the most common ones:

### 2.1. Registering Globally in `main.ts`

``` ts 

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('users API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}

bootstrap();

``` 

### 2.2. Registering at the Controller Level

``` ts 

@ApiTags('USERS MGMT')
@Controller('user')
@UseFilters(new AllExceptionsFilter())
export class UserController {

    constructor(private userService: UserService) { }
    
 @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findOne(id);
    }
}

``` 


### 2.3. Registering at the Module Level (Local Filter)
In your module file `(e.g., user.module.ts)`:

``` ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class UserModule {}
```


## 3. Using the Filter in Your Service 

Throw an HTTP Exception as needed:

``` ts

import { NotFoundException } from '@nestjs/common';

 async findOne(id: string): Promise<UserEntity> {
  const foundUser = await this.userRepository.findOne({ where: { id } });
  if (!foundUser) {
    throw new NotFoundException('User Not Found');
  }
  return foundUser;
}
```


###  Where to Throw Exceptions: Controller or Service?

+ ✅ Best Practice: Throw exceptions in the service layer, where business logic lives.
This keeps your controller clean and follows the Separation of Concerns (SoC) principle.


## 4. Optional: Creating Custom Exceptions:

You can also define custom exceptions:

``` ts 
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super({ message }, HttpStatus.FORBIDDEN);
  }
}
```

Usage:
``` ts 
throw new CustomForbiddenException('You do not have permission to access this resource');

```

## 5. Handling Uncaught JavaScript Errors

The global exception filter also catches standard JavaScript runtime errors such as:

- `TypeError`
- `ReferenceError`
- `SyntaxError`
- Any unhandled `Error` instance

These are **not** instances of `HttpException`, so the filter will return:

- **Status:** 500 Internal Server Error
- **Message:** The `Error.message` (or a generic one if not available)

### 🔧 Example: Throwing a non-HTTP error

```ts

async findOne(id: string): Promise<UserEntity> {
  const foundUser = await this.userRepository.findOne({ where: { id } });

  if (!foundUser) {
    // Simulating a runtime error (instead of using Nest's NotFoundException)
    throw new Error('Something went wrong while fetching the user');
  }

  return foundUser;
}
```

###  Response Example:
``` json 
{
  "statusCode": 500,
  "timestamp": "2025-08-07T15:21:10.000Z",
  "path": "/user/123",
  "error": "Something went wrong while fetching the user"
}

```

### Note :
This is helpful during development but in production, consider wrapping such logic in meaningful custom exceptions.


## 6. Sample Error Response Format

``` json
{
  "statusCode": 404,
  "timestamp": "2025-08-07T15:12:34.000Z",
  "path": "/user/123",
  "error": "User Not Found"
}
```
## 7. Additional Resources

- [NestJS Exception-Filters Documentation](https://docs.nestjs.com/exception-filters)  
  Official NestJS documentation for Exception-Filters Implementation



## 8. Summary

*  Use @Catch() to define global or scoped exception filters.

* Register filters globally (app.useGlobalFilters) or locally via @UseFilters() or the APP_FILTER token.

* Catch both HTTP exceptions (HttpException) and unexpected runtime errors (e.g., TypeError, Error, etc.).

* Keep your controller lean by throwing exceptions inside the service layer.

* Optionally, define custom exception classes to improve clarity and control over your API error responses.
