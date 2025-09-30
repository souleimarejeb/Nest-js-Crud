# Custom Decorators for NestJS REST APIs

Decorators is an expression which returns a function and can take a target, name and property descriptor as arguments.
They are applied using ' @ ' can be defined for either a class , a method or property 


## Common Use Cases : 

- Validation 
- Authorization 
- Logging 
- Caching
- Performance  

#### 👉 Why use decorators?
Decorators are useful when you want to encapsulate logic into reusable components, making your code cleaner, more modular, and easier to maintain.

Example file: src/common/decorators/logger.decorator.ts

## 1.Get Started 

To create a custom decorator in NestJS, we’ll first create a function. In this case, we will create a User decorator that extracts the user from the request and returns the user object or specific fields, such as the user’s id or username.

#### Custom User Decorator Example
src/common/decorators/user.decorator.ts

``` ts 
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User=createParamDecorator(
    (data:string,ctx :ExecutionContext)=>{
        const request= ctx.switchToHttp().getRequest(); // Get the request 
       const user=request.user;  // Extract the user from the request 
       return data? user?.[data]:user;  // return the user(by username / id )if found ,else undefined 
    }
)
```

#### Explanation

- The  __Create Param__ __Decorator__ : it is function provided by nestjs , to create a custom decorator , takes Factory function as a parameter 

- The __data__  parameter is passed to the decorator's factory function. This can be used to fetch the user by a specific property, such as id or username. ( you can define it as unkown and not use it ).

- The __ctx__ which is ExecutionContext , object provided by NestJS. It contains details about the execution context of the handler the decorator is applied to.

### 2.Use in Controller 

In the following example, @User('id') calls the factory function and extracts the user from the request, specifically the user.id.

#### Controller Example

```ts 
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/database/models/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('USERS MGMT')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @Get()
    async findOne(@User('id') id: string): Promise<UserEntity> {
        return this.userService.findOne(id);
    }
}

```

In this example, @User('id') calls the factory function of the decorator, which extracts the user from the request object and retrieves the user's id.

### Notes 
- The @User() decorator allows you to easily extract the user object or specific properties (e.g., id) from the request, making it simpler to handle authentication-related logic.

- You can customize the decorator to fetch any property from the user, depending on your use case.

- If you’re interested in seeing an example of logging, you can check the logging implementation directly in the project.


---- 
## Additional Resources

- [NestJS Swagger Documentation](docs.nestjs.com/custom-decorators)  
  Official NestJS documentation for Custom Decorators


- [Supplement](https://medium.com/@hameezrizwan/custom-decorator-in-nestjs-f8cecaad0f7a)  
  A detailed example that inspired this tutorial.
