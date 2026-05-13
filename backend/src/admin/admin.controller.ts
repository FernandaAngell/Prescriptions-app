import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
  ) {}

  @Get('metrics')
  @Roles('ADMIN')
  getMetrics() {
    return this.adminService.getMetrics();
  }
}