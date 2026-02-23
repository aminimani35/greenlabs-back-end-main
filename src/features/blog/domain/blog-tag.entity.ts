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

@Entity('blog_tags')
@Index(['slug'], { unique: true })
export class BlogTag {
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

  @Column({ name: 'post_count', default: 0 })
  postCount: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToMany(() => BlogPost, (post) => post.tags)
  posts: BlogPost[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
