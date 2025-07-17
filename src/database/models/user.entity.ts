import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.model";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {

  @ApiProperty()
  @Column({ type: 'varchar', length: '250', nullable: true })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '1250', nullable: true })
  last_name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '250', nullable: true })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '250', nullable: true })
  phone: string;
}

