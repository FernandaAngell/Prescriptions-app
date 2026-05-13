import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { AdminModule } from './admin/admin.module';
imports: [UsersModule, PrismaModule, AuthModule]

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, PrescriptionsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
