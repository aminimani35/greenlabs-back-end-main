import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RoleRepository } from '../repositories/role.repository';
import { PermissionRepository } from '../repositories/permission.repository';
import { User } from '../../users/domain/user.entity';

@Injectable()
export class AuthSeederService implements OnModuleInit {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedPermissions();
    await this.seedRoles();
    await this.seedSuperAdmin();
  }

  private async seedPermissions() {
    const permissions = [
      // Blog permissions
      {
        name: 'blog:create',
        resource: 'blog',
        action: 'create',
        description: 'Create blog posts',
      },
      {
        name: 'blog:read',
        resource: 'blog',
        action: 'read',
        description: 'Read blog posts',
      },
      {
        name: 'blog:update',
        resource: 'blog',
        action: 'update',
        description: 'Update blog posts',
      },
      {
        name: 'blog:delete',
        resource: 'blog',
        action: 'delete',
        description: 'Delete blog posts',
      },
      {
        name: 'blog:publish',
        resource: 'blog',
        action: 'publish',
        description: 'Publish/unpublish blog posts',
      },
      // User permissions
      {
        name: 'user:create',
        resource: 'user',
        action: 'create',
        description: 'Create users',
      },
      {
        name: 'user:read',
        resource: 'user',
        action: 'read',
        description: 'Read users',
      },
      {
        name: 'user:update',
        resource: 'user',
        action: 'update',
        description: 'Update users',
      },
      {
        name: 'user:delete',
        resource: 'user',
        action: 'delete',
        description: 'Delete users',
      },
      // Product permissions
      {
        name: 'product:create',
        resource: 'product',
        action: 'create',
        description: 'Create products',
      },
      {
        name: 'product:read',
        resource: 'product',
        action: 'read',
        description: 'Read products',
      },
      {
        name: 'product:update',
        resource: 'product',
        action: 'update',
        description: 'Update products',
      },
      {
        name: 'product:delete',
        resource: 'product',
        action: 'delete',
        description: 'Delete products',
      },
      // CRM Customer permissions
      {
        name: 'crm:customer:create',
        resource: 'crm-customer',
        action: 'create',
        description: 'Create customers',
      },
      {
        name: 'crm:customer:read',
        resource: 'crm-customer',
        action: 'read',
        description: 'Read customers',
      },
      {
        name: 'crm:customer:update',
        resource: 'crm-customer',
        action: 'update',
        description: 'Update customers',
      },
      {
        name: 'crm:customer:delete',
        resource: 'crm-customer',
        action: 'delete',
        description: 'Delete customers',
      },
      // CRM Support Ticket permissions
      {
        name: 'crm:ticket:create',
        resource: 'crm-ticket',
        action: 'create',
        description: 'Create support tickets',
      },
      {
        name: 'crm:ticket:read',
        resource: 'crm-ticket',
        action: 'read',
        description: 'Read support tickets',
      },
      {
        name: 'crm:ticket:update',
        resource: 'crm-ticket',
        action: 'update',
        description: 'Update support tickets',
      },
      {
        name: 'crm:ticket:delete',
        resource: 'crm-ticket',
        action: 'delete',
        description: 'Delete support tickets',
      },
      {
        name: 'crm:ticket:assign',
        resource: 'crm-ticket',
        action: 'assign',
        description: 'Assign tickets to agents',
      },
      // CRM Notes and Activities
      {
        name: 'crm:note:create',
        resource: 'crm-note',
        action: 'create',
        description: 'Create customer notes',
      },
      {
        name: 'crm:note:read',
        resource: 'crm-note',
        action: 'read',
        description: 'Read customer notes',
      },
      {
        name: 'crm:activity:read',
        resource: 'crm-activity',
        action: 'read',
        description: 'Read customer activities',
      },
      // Notification permissions
      {
        name: 'notification:create',
        resource: 'notification',
        action: 'create',
        description: 'Create notifications',
      },
      {
        name: 'notification:read',
        resource: 'notification',
        action: 'read',
        description: 'Read notifications',
      },
      {
        name: 'notification:update',
        resource: 'notification',
        action: 'update',
        description: 'Update notifications',
      },
      {
        name: 'notification:delete',
        resource: 'notification',
        action: 'delete',
        description: 'Delete notifications',
      },
    ];

    for (const permData of permissions) {
      const existing = await this.permissionRepository.findByName(
        permData.name,
      );
      if (!existing) {
        await this.permissionRepository.create(permData);
      }
    }
  }

  private async seedRoles() {
    // Admin role with all permissions
    let adminRole = await this.roleRepository.findByName('admin');
    if (!adminRole) {
      const allPermissions = await this.permissionRepository.findAll();
      adminRole = await this.roleRepository.create({
        name: 'admin',
        description: 'Administrator with full access',
        permissions: allPermissions,
      });
    }

    // Editor role with blog and product permissions
    let editorRole = await this.roleRepository.findByName('editor');
    if (!editorRole) {
      const editorPermissions = await Promise.all([
        this.permissionRepository.findByName('blog:create'),
        this.permissionRepository.findByName('blog:read'),
        this.permissionRepository.findByName('blog:update'),
        this.permissionRepository.findByName('blog:publish'),
        this.permissionRepository.findByName('product:create'),
        this.permissionRepository.findByName('product:read'),
        this.permissionRepository.findByName('product:update'),
      ]);

      editorRole = await this.roleRepository.create({
        name: 'editor',
        description: 'Content editor with blog and product access',
        permissions: editorPermissions.filter(Boolean),
      });
    }

    // User role with basic read permissions
    let userRole = await this.roleRepository.findByName('user');
    if (!userRole) {
      const userPermissions = await Promise.all([
        this.permissionRepository.findByName('blog:read'),
        this.permissionRepository.findByName('product:read'),
        this.permissionRepository.findByName('user:read'),
      ]);

      userRole = await this.roleRepository.create({
        name: 'user',
        description: 'Basic user with read-only access',
        permissions: userPermissions.filter(Boolean),
      });
    }
  }

  private async seedSuperAdmin() {
    // Check if super admin already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'aminimani95@proton.me' },
    });

    if (existingAdmin) {
      console.log('✅ Super admin user already exists');
      return;
    }

    // Get admin role with all permissions
    const adminRole = await this.roleRepository.findByName('admin');
    if (!adminRole) {
      console.error('❌ Admin role not found. Cannot create super admin.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Ar@d1260621', 10);

    // Create super admin user
    const superAdmin = this.userRepository.create({
      email: 'aminimani95@proton.me',
      name: 'Super Admin',
      password: hashedPassword,
      isActive: true,
      isEmailVerified: true,
      roles: [adminRole],
    });

    await this.userRepository.save(superAdmin);

    console.log('✅ Super admin user created successfully');
    console.log('   Email: aminimani95@proton.me');
    console.log('   Role: Admin (all permissions)');
  }
}
