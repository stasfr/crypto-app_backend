import { Public } from '@common/decorators';
import { Controller, Get, Query, ParseIntPipe, Optional } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('binance')
@Controller('binance')
export class BinanceController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('data')
  @Public()
  @ApiOperation({ summary: 'Get Binance data with optional filters' })
  @ApiQuery({ name: 'startTime', required: false, type: Number, description: 'Start time in Unix milliseconds' })
  @ApiQuery({ name: 'endTime', required: false, type: Number, description: 'End time in Unix milliseconds' })
  async getData(
    @Query('startTime', new ParseIntPipe({ optional: true })) startTime?: number,
    @Query('endTime', new ParseIntPipe({ optional: true })) endTime?: number,
  ) {
    const filters: any = {};



    if (startTime !== undefined) {
      filters.openTime = { gte: new Date(startTime) };
    }

    if (endTime !== undefined) {
      filters.openTime = { ...filters.openTime, lte: new Date(endTime) };
    }

    console.log('Filters applied:', filters);

    const data = await this.prisma.binanceData.findMany({
      where: filters,
      orderBy: { openTime: 'asc' },
    });

    return data;
  }
}
