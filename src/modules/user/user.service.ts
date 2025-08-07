import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async findAll(): Promise<UserEntity[]> {

        const user = await this.userRepository.find();
        if (!user) throw new ConflictException();
        return user;
    }

    async findOne(id: string): Promise<UserEntity> {
        const foundUser = await this.userRepository.findOne({ where: { id } });
        if (!foundUser) throw new NotFoundException("User Not Found");
        return foundUser;
    }

    async create(userData: Partial<UserEntity>): Promise<UserEntity> {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity> {
        await this.userRepository.update(id, userData);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }


}
