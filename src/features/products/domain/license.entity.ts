import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

export enum LicenseStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
  TRIAL = 'trial',
}

@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  licenseKey: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.licenses)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({
    type: 'enum',
    enum: LicenseStatus,
    default: LicenseStatus.ACTIVE,
  })
  status: LicenseStatus;

  @Column({ type: 'timestamp', name: 'issued_at' })
  issuedAt: Date;

  @Column({ type: 'timestamp', name: 'expires_at', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamp', name: 'activated_at', nullable: true })
  activatedAt: Date;

  @Column({ type: 'int', default: 1, name: 'max_activations' })
  maxActivations: number;

  @Column({ type: 'int', default: 0, name: 'current_activations' })
  currentActivations: number;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true, name: 'allowed_domains' })
  allowedDomains: string[];

  @Column({ type: 'simple-array', nullable: true, name: 'device_fingerprints' })
  deviceFingerprints: string[];

  @Column({ type: 'timestamp', name: 'last_validated_at', nullable: true })
  lastValidatedAt: Date;

  @Column({ length: 255, nullable: true, name: 'issued_by' })
  issuedBy: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
