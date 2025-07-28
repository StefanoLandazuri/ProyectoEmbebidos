import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findById(id);
  }

  @Get('rfid/:uid')
  async findByRfid(@Param('uid') uid: string) {
    return await this.usersService.findByRfidUid(uid);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<CreateUserDto>) {
    return await this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.delete(id);
    return { message: 'Usuario eliminado correctamente' };
  }
}