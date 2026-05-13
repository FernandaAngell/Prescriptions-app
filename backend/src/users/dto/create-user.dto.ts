import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export class CreateUserDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!: Role;
}