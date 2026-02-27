import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { License } from './license.entity';

export enum ProductType {
  SUBSCRIPTION = 'subscription',
  PERPETUAL = 'perpetual',
  TRIAL = 'trial',
}

export enum SubscriptionPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100, unique: true })
  productCode: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.SUBSCRIPTION,
  })
  type: ProductType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: SubscriptionPeriod,
    default: SubscriptionPeriod.YEARLY,
  })
  subscriptionPeriod: SubscriptionPeriod;

  @Column({ type: 'int', default: 30 })
  trialDays: number;

  @Column({ type: 'int', nullable: true })
  maxUsers: number;

  @Column({ type: 'int', nullable: true })
  maxDevices: number;

  @Column({ type: 'simple-json', nullable: true })
  features: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 50, nullable: true })
  version: string;

  @OneToMany(() => License, (license) => license.product)
  licenses: License[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
