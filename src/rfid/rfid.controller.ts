import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RfidService } from './rfid.service';

@Controller('rfid')
export class RfidController {
  constructor(private readonly rfidService: RfidService) {}

  @Post('scan')
  async processScan(@Body() body: { rfid_uid: string }) {
    return await this.rfidService.processRfidScan(body.rfid_uid);
  }

  @Get('test/:uid')
  async testScan(@Param('uid') uid: string) {
    return await this.rfidService.processRfidScan(uid);
  }
}