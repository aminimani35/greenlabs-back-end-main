import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../auth/domain/role.entity';
import { Customer } from '../../crm/domain/customer.entity';

export enum UserType {
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.STAFF,
    name: 'user_type',
  })
  userType: UserType;

  @Column({ nullable: true, name: 'customer_id' })
  customerId: string;

  @OneToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false, name: 'is_email_verified' })
  isEmailVerified: boolean;

  @Column({ nullable: true, name: 'last_login_at' })
  lastLoginAt: Date;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
