import { IsEmail, Length, Validate } from 'class-validator';
import { PasswordValidate } from 'src/validate/passwordValidate.validate';
export class LoginUser {
  @IsEmail()
  readonly email: string;

  @Length(8, 16)
  @Validate(PasswordValidate)
  readonly password: string;
}
