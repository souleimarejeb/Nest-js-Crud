import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.model";

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: '250', nullable: true })
  name: string;

  @Column({ type: 'varchar', length: '1250', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: '250', nullable: true })
  email: string;

  @Column({ type: 'varchar', length: '250', nullable: true })
  phone: string;
}

