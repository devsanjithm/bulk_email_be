import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,JwtService,PrismaService]
})
export class AdminModule {}
