import {
  Controller,
  Get,
  Post,
  Patch,
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
} from '@nestjs/swagger';
import { LicenseService } from '../services/license.service';
import {
  CreateLicenseDto,
  ValidateLicenseDto,
  ActivateLicenseDto,
  DeactivateLicenseDto,
} from '../dto/license.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Licenses')
@ApiBearerAuth('JWT-auth')
@Controller('licenses')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Post()
  @Roles('admin', 'editor')
  @RequirePermissions('product:create')
  @ApiOperation({ summary: 'Create a new license' })
  @ApiResponse({ status: 201, description: 'License created successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createLicense(@Body() dto: CreateLicenseDto, @CurrentUser() user: any) {
    return this.licenseService.createLicense(dto, user.userId);
  }

  @Post('validate')
  @Public()
  @ApiOperation({
    summary: 'Validate a license key',
    description: 'Public endpoint to validate license validity',
  })
  @ApiResponse({ status: 200, description: 'Validation result returned' })
  async validateLicense(@Body() dto: ValidateLicenseDto) {
    return this.licenseService.validateLicense(dto);
  }

  @Post('activate')
  @Public()
  @ApiOperation({
    summary: 'Activate a license',
    description: 'Activate a license on a device',
  })
  @ApiResponse({ status: 200, description: 'License activated successfully' })
  @ApiResponse({ status: 400, description: 'Activation failed' })
  async activateLicense(@Body() dto: ActivateLicenseDto) {
    return this.licenseService.activateLicense(dto);
  }

  @Post('deactivate')
  @Public()
  @ApiOperation({
    summary: 'Deactivate a license',
    description: 'Remove a device activation from a license',
  })
  @ApiResponse({
    status: 200,
    description: 'License deactivated successfully',
  })
  async deactivateLicense(@Body() dto: DeactivateLicenseDto) {
    return this.licenseService.deactivateLicense(dto);
  }

  @Get(':licenseKey')
  @RequirePermissions('product:read')
  @ApiOperation({ summary: 'Get license details' })
  @ApiParam({ name: 'licenseKey', description: 'License key' })
  @ApiResponse({ status: 200, description: 'License details returned' })
  @ApiResponse({ status: 404, description: 'License not found' })
  async getLicense(@Param('licenseKey') licenseKey: string) {
    return this.licenseService.getLicense(licenseKey);
  }

  @Get('customer/:customerId')
  @RequirePermissions('product:read')
  @ApiOperation({ summary: 'Get all licenses for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer licenses returned' })
  async getLicensesByCustomer(@Param('customerId') customerId: string) {
    return this.licenseService.getLicensesByCustomer(customerId);
  }

  @Get('project/:projectId')
  @RequirePermissions('product:read')
  @ApiOperation({ summary: 'Get all licenses for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project licenses returned' })
  async getLicensesByProject(@Param('projectId') projectId: string) {
    return this.licenseService.getLicensesByProject(projectId);
  }

  @Patch(':licenseKey/revoke')
  @Roles('admin')
  @RequirePermissions('product:delete')
  @ApiOperation({ summary: 'Revoke a license' })
  @ApiParam({ name: 'licenseKey', description: 'License key' })
  @ApiResponse({ status: 200, description: 'License revoked' })
  async revokeLicense(@Param('licenseKey') licenseKey: string) {
    return this.licenseService.revokeLicense(licenseKey);
  }

  @Patch(':licenseKey/suspend')
  @Roles('admin', 'editor')
  @RequirePermissions('product:update')
  @ApiOperation({ summary: 'Suspend a license' })
  @ApiParam({ name: 'licenseKey', description: 'License key' })
  @ApiResponse({ status: 200, description: 'License suspended' })
  async suspendLicense(@Param('licenseKey') licenseKey: string) {
    return this.licenseService.suspendLicense(licenseKey);
  }

  @Patch(':licenseKey/reactivate')
  @Roles('admin', 'editor')
  @RequirePermissions('product:update')
  @ApiOperation({ summary: 'Reactivate a suspended license' })
  @ApiParam({ name: 'licenseKey', description: 'License key' })
  @ApiResponse({ status: 200, description: 'License reactivated' })
  async reactivateLicense(@Param('licenseKey') licenseKey: string) {
    return this.licenseService.reactivateLicense(licenseKey);
  }
}
