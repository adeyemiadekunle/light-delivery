import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@lightdelivery.example' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, format: 'password', writeOnly: true })
  @IsString()
  @MinLength(8)
  password!: string;
}
