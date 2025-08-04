import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { LockersService } from './lockers.service';
import { CreateLockerDto } from './dto/create-locker.dto';
import { UpdateLockerDto } from './dto/update-locker.dto';

@Controller('lockers')
export class LockersController {
  constructor(private readonly lockersService: LockersService) { }

  @Post()
  async create(@Body() createLockerDto: CreateLockerDto) {
    return await this.lockersService.create(createLockerDto);
  }

  @Get()
  async findAll() {
    return await this.lockersService.findAll();
  }

  @Get('stats')
  async getStats() {
    return await this.lockersService.getLockerStats();
  }

  @Get('logs/all')
  async getAllLogs(@Query('limit') limit?: number) {
    return this.lockersService.getAllLockerLogs(limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.lockersService.findById(id);
  }

  @Post('assign')
  async assignLocker(@Body() body: { userId: number; lockerId?: number }) {
    return await this.lockersService.assignLocker(body.userId, body.lockerId);
  }

  @Post(':id/release')
  async releaseLocker(@Param('id', ParseIntPipe) id: number, @Body() body?: { adminRelease?: boolean }) {
    return await this.lockersService.releaseLocker(id, body?.adminRelease || false);
  }

  @Patch(':id/weight')
  async updateWeight(@Param('id', ParseIntPipe) id: number, @Body() body: { weight: number }) {
    return await this.lockersService.updateWeight(id, body.weight);
  }

  @Post(':id/emergency')
  async emergencyOpen(@Param('id', ParseIntPipe) id: number) {
    return await this.lockersService.emergencyOpen(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateLockerDto: UpdateLockerDto) {
    // Implementar actualización general del locker
    return { message: 'Funcionalidad de actualización pendiente' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    // Implementar eliminación de locker
    return { message: 'Funcionalidad de eliminación pendiente' };
  }
}