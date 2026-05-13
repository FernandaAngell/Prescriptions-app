import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';

import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(
    private prescriptionsService: PrescriptionsService,
  ) {}

  @Post()
  @Roles('DOCTOR')
  create(@Body() body: CreatePrescriptionDto) {
    return this.prescriptionsService.createPrescription(body);
  }

  @Get()
  @Roles('DOCTOR', 'PATIENT', 'ADMIN')
  getAll() {
    return this.prescriptionsService.getPrescriptions();
  }

  @Patch(':id/consume')
  @Roles('PATIENT')
  consume(@Param('id') id: string) {
    return this.prescriptionsService.consumePrescription(id);
  }
}