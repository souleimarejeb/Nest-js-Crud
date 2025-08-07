import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'; import { UserService } from './user.service';
import { UserEntity } from 'src/database/models/user.entity';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

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
