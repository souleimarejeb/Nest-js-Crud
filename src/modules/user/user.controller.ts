import { Body, Controller, Param, Post, Get, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/models/user.model';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Post()
    create(@Body() payload: User) {
        return this.userService.create(payload);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        this.userService.delete(id);
    }


}
