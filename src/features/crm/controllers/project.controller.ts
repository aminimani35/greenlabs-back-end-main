import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles('admin', 'editor')
  @RequirePermissions('crm:customer:create')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }

  @Get()
  @RequirePermissions('crm:customer:read')
  @ApiOperation({ summary: 'Get all projects' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Projects returned successfully' })
  async getAllProjects(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
  ) {
    return this.projectService.getAllProjects({ customerId, status });
  }

  @Get(':id')
  @RequirePermissions('crm:customer:read')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project returned successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProject(@Param('id') id: string) {
    return this.projectService.getProject(id);
  }

  @Get('customer/:customerId')
  @RequirePermissions('crm:customer:read')
  @ApiOperation({ summary: 'Get all projects for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Projects returned successfully' })
  async getProjectsByCustomer(@Param('customerId') customerId: string) {
    return this.projectService.getProjectsByCustomer(customerId);
  }

  @Put(':id')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:customer:update')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.updateProject(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @RequirePermissions('crm:customer:delete')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async deleteProject(@Param('id') id: string) {
    await this.projectService.deleteProject(id);
    return { message: 'Project deleted successfully' };
  }
}
