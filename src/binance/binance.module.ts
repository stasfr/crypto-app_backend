import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BinanceController],
  providers: [BinanceService, PrismaService],
})
export class BinanceModule {}
