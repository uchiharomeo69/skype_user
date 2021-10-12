import { EmailValidate } from './../../validate/emailValidate.validate';
import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { PasswordValidate } from 'src/validate/passwordValidate.validate';
import { UseFilters } from '@nestjs/common';

export class CreateUser {
  @IsEmail()
  @Validate(EmailValidate)
  readonly email: string;
  @Length(8)
  @Validate(PasswordValidate)
  readonly password: string;
  @IsNotEmpty()
  readonly name: string;
}
