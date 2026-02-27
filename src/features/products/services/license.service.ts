import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License, LicenseStatus } from '../domain/license.entity';
import { Product } from '../domain/product.entity';
import {
  CreateLicenseDto,
  ValidateLicenseDto,
  ActivateLicenseDto,
  DeactivateLicenseDto,
} from '../dto/license.dto';
import * as crypto from 'crypto';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createLicense(
    dto: CreateLicenseDto,
    issuedBy: string,
  ): Promise<License> {
    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Generate unique license key
    const licenseKey = this.generateLicenseKey(product.productCode);

    const license = this.licenseRepository.create({
      licenseKey,
      productId: dto.productId,
      customerId: dto.customerId,
      projectId: dto.projectId,
      issuedAt: new Date(),
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      maxActivations: dto.maxActivations || 1,
      allowedDomains: dto.allowedDomains || [],
      metadata: dto.metadata || {},
      notes: dto.notes,
      issuedBy,
      status: LicenseStatus.ACTIVE,
    });

    return await this.licenseRepository.save(license);
  }

  async validateLicense(dto: ValidateLicenseDto): Promise<{
    valid: boolean;
    license?: License;
    reason?: string;
  }> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey: dto.licenseKey },
      relations: ['product'],
    });

    if (!license) {
      return { valid: false, reason: 'License not found' };
    }

    // Check product match
    if (license.productId !== dto.productId) {
      return { valid: false, reason: 'License not valid for this product' };
    }

    // Check status
    if (license.status !== LicenseStatus.ACTIVE) {
      return {
        valid: false,
        reason: `License is ${license.status}`,
      };
    }

    // Check expiration
    if (license.expiresAt && new Date() > new Date(license.expiresAt)) {
      await this.licenseRepository.update(license.id, {
        status: LicenseStatus.EXPIRED,
      });
      return { valid: false, reason: 'License has expired' };
    }

    // Check domain restrictions
    if (
      dto.domain &&
      license.allowedDomains.length > 0 &&
      !license.allowedDomains.includes(dto.domain)
    ) {
      return {
        valid: false,
        reason: 'Domain not authorized for this license',
      };
    }

    // Update last validated timestamp
    await this.licenseRepository.update(license.id, {
      lastValidatedAt: new Date(),
    });

    return { valid: true, license };
  }

  async activateLicense(dto: ActivateLicenseDto): Promise<License> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey: dto.licenseKey },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    if (license.status !== LicenseStatus.ACTIVE) {
      throw new BadRequestException(`License is ${license.status}`);
    }

    if (license.expiresAt && new Date() > new Date(license.expiresAt)) {
      throw new BadRequestException('License has expired');
    }

    // Check activation limit
    if (license.currentActivations >= license.maxActivations) {
      throw new BadRequestException('Maximum activations reached');
    }

    // Add device fingerprint if provided
    const deviceFingerprints = license.deviceFingerprints || [];
    if (
      dto.deviceFingerprint &&
      !deviceFingerprints.includes(dto.deviceFingerprint)
    ) {
      deviceFingerprints.push(dto.deviceFingerprint);
    }

    await this.licenseRepository.update(license.id, {
      currentActivations: license.currentActivations + 1,
      deviceFingerprints,
      activatedAt: license.activatedAt || new Date(),
      metadata: { ...license.metadata, ...dto.metadata },
    });

    return await this.licenseRepository.findOne({
      where: { id: license.id },
    });
  }

  async deactivateLicense(dto: DeactivateLicenseDto): Promise<License> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey: dto.licenseKey },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    let deviceFingerprints = license.deviceFingerprints || [];
    if (dto.deviceFingerprint) {
      deviceFingerprints = deviceFingerprints.filter(
        (fp) => fp !== dto.deviceFingerprint,
      );
    }

    const currentActivations = Math.max(0, license.currentActivations - 1);

    await this.licenseRepository.update(license.id, {
      currentActivations,
      deviceFingerprints,
    });

    return await this.licenseRepository.findOne({
      where: { id: license.id },
    });
  }

  async getLicense(licenseKey: string): Promise<License> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey },
      relations: ['product'],
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return license;
  }

  async getLicensesByCustomer(customerId: string): Promise<License[]> {
    return await this.licenseRepository.find({
      where: { customerId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getLicensesByProject(projectId: string): Promise<License[]> {
    return await this.licenseRepository.find({
      where: { projectId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async revokeLicense(licenseKey: string): Promise<License> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    await this.licenseRepository.update(license.id, {
      status: LicenseStatus.REVOKED,
    });

    return await this.licenseRepository.findOne({
      where: { id: license.id },
    });
  }

  async suspendLicense(licenseKey: string): Promise<License> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    await this.licenseRepository.update(license.id, {
      status: LicenseStatus.SUSPENDED,
    });

    return await this.licenseRepository.findOne({
      where: { id: license.id },
    });
  }

  async reactivateLicense(licenseKey: string): Promise<License> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    if (license.status === LicenseStatus.REVOKED) {
      throw new BadRequestException('Cannot reactivate a revoked license');
    }

    await this.licenseRepository.update(license.id, {
      status: LicenseStatus.ACTIVE,
    });

    return await this.licenseRepository.findOne({
      where: { id: license.id },
    });
  }

  private generateLicenseKey(productCode: string): string {
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .createHash('sha256')
      .update(`${productCode}-${timestamp}-${randomPart}`)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();

    // Format: XXXX-XXXX-XXXX-XXXX
    return `${hash.substring(0, 4)}-${hash.substring(4, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}`;
  }
}
