import { Module } from '@nestjs/common';
import { HeaderService } from './header.service';
import { HeaderController } from './header.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [HeaderController],
  providers: [HeaderService]
})
export class HeaderModule {}
