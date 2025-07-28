import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { LockerStatus } from '../../database/entities/locker.entity';

export class CreateLockerDto {
  @IsString()
  locker_number: string;

  @IsOptional()
  @IsIn(Object.values(LockerStatus))
  status?: LockerStatus;

  @IsOptional()
  @IsNumber()
  weight_threshold?: number;

  @IsOptional()
  @IsString()
  location?: string;
}