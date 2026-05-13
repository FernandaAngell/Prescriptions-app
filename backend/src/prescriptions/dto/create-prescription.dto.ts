import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class PrescriptionItemDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  dosage?: string;

  @IsOptional()
  quantity?: number;

  @IsOptional()
  instructions?: string;
}

export class CreatePrescriptionDto {
  @IsNotEmpty()
  patientId!: string;

  @IsNotEmpty()
  authorId!: string;

  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items!: PrescriptionItemDto[];
}