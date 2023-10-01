import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret:  process.env.SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService,PrismaService]
})
export class AdminModule {}
