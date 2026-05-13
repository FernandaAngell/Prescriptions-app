import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const totalUsers =
      await this.prisma.user.count();

    const totalDoctors =
      await this.prisma.user.count({
        where: {
          role: 'DOCTOR',
        },
      });

    const totalPatients =
      await this.prisma.user.count({
        where: {
          role: 'PATIENT',
        },
      });

    const totalPrescriptions =
      await this.prisma.prescription.count();

    const consumedPrescriptions =
      await this.prisma.prescription.count({
        where: {
          status: 'consumed',
        },
      });

    const pendingPrescriptions =
      await this.prisma.prescription.count({
        where: {
          status: 'pending',
        },
      });

    return {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalPrescriptions,
      consumedPrescriptions,
      pendingPrescriptions,
    };
  }
}