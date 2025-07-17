import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/database/models/user.entity';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('USERS MGMT')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @Get()
    @ApiResponse({ status: 200, description: 'Retrieved succssfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async findAll(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UserEntity,
        description: 'Json structure for user object',
    })
    async create(@Body() userData: Partial<UserEntity>): Promise<UserEntity> {
        return this.userService.create(userData);
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UserEntity,
    })
    async update(@Param('id') id: string, @Body() userData: Partial<UserEntity>): Promise<UserEntity> {
        return this.userService.update(id, userData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.userService.delete(id);
    }

}
