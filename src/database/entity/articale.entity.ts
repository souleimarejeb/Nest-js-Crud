import {
    Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { UserEntity } from "./user.entity";
import { User } from "src/models/user.model";


@Entity({ name: "articale" })  // entity name in mySQL
export class ArticaleEntity {

    @PrimaryGeneratedColumn()   // Primary Key
    id: string

    @Column()
    description: string;

    @Column()
    title: string;

    @Column()
    createdAr: Date;


    @ManyToOne(() => UserEntity, (user) => user.articales)
    @JoinColumn({ name: "flightId" })
    user: UserEntity;


}
