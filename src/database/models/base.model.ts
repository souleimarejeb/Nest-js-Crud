import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ default: true })
  record_status: boolean;

  @Column({ default: '' })
  created_by: string;

  @Column({ default: '' })
  updated_by: string;

  @Column({ default: '' })
  deleted_by: string;

  @Column({ default: '' })
  tenant: string;
}
