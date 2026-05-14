import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async createPrescription(data: CreatePrescriptionDto) {
    return this.prisma.prescription.create({
      data: {
        code: `RX-${Date.now()}`,
        notes: data.notes,
        patientId: data.patientId,
        authorId: data.authorId,

        items: {
          create: data.items,
        },
      },

      include: {
        items: true,

        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },

        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getPrescriptions(user: any) {
  if (user.role === 'PATIENT') {
    return this.prisma.prescription.findMany({
      where: {
        patientId: user.id,
      },

      include: {
        items: true,

        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },

        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
  }

  return this.prisma.prescription.findMany({
    include: {
      items: true,

      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },

      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
}

  async consumePrescription(id: string) {
    return this.prisma.prescription.update({
      where: { id },

      data: {
        status: 'consumed',
        consumedAt: new Date(),
      },
    });
  }
}