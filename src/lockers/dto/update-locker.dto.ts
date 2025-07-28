import { IsOptional, IsNumber, IsBoolean, IsIn } from 'class-validator';
import { LockerStatus } from '../../database/entities/locker.entity';

export class UpdateLockerDto {
  @IsOptional()
  @IsIn(Object.values(LockerStatus))
  status?: LockerStatus;

  @IsOptional()
  @IsNumber()
  current_weight?: number;

  @IsOptional()
  @IsNumber()
  weight_threshold?: number;

  @IsOptional()
  @IsBoolean()
  is_locked?: boolean;
}
