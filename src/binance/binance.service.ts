import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Выполняем начальный запрос при запуске приложения
    await this.fetchData();
  }

  @Cron('0 * * * *') // Запускается каждый час
  async fetchData() {
    try {
      const symbol = 'BTCUSDT'; // Замените на нужный символ
      const interval = '1d';
      const limit = 365; // Максимум 365 записей за раз

      const response = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      );

      const data = response.data.map((entry) => ({
        symbol,
        openTime: new Date(entry[0]),
        open: parseFloat(entry[1]),
        high: parseFloat(entry[2]),
        low: parseFloat(entry[3]),
        close: parseFloat(entry[4]),
        volume: parseFloat(entry[5]),
        closeTime: new Date(entry[6]),
        interval,
      }));

      await this.prisma.binanceData.createMany({
        data,
        skipDuplicates: true,
      });

      console.log('Data fetched and saved successfully');
    } catch (error) {
      console.error('Error fetching data from Binance API:', error);
    }
  }
}
