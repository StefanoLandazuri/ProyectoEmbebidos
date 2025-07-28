import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  rfid_uid: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsIn(['student', 'teacher', 'admin'])
  role?: string;
}