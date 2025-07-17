import { Injectable } from '@nestjs/common';
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
