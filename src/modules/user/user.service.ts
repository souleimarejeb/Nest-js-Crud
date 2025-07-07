import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {

    private users: User[] = [];


    create(payload: User): User {
        this.users.push(payload);
        return payload;
    }

    findOne(id: string): User {
        return this.users.find(user => user.id == id);

    }

    findAll(): User[] {
        return this.users;
    }


    delete(id: string): void {
        this.users = this.users.filter((user) => user.id !== id);
    }

}
