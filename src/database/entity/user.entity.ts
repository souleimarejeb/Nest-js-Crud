import {
    Column, Entity, JoinColumn, PrimaryGeneratedColumn,
    OneToMany
} from "typeorm";
import { ArticaleEntity } from "./articale.entity";


@Entity({ name: "users" })  // entity name in mySQL
export class UserEntity {

    @PrimaryGeneratedColumn()   // Primary Key
    id: string

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    birthdate: Date;


    @OneToMany(() => ArticaleEntity, (articale) => articale.user)
    articales: ArticaleEntity;

}
