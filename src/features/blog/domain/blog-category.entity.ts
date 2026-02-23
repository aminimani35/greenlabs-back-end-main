import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { BlogPost } from './blog-post.entity';

@Entity('blog_categories')
@Index(['slug'], { unique: true })
export class BlogCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true, length: 7 })
  color: string; // Hex color code

  @Column({ nullable: true })
  icon: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ name: 'post_count', default: 0 })
  postCount: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @ManyToMany(() => BlogPost, (post) => post.categories)
  posts: BlogPost[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
