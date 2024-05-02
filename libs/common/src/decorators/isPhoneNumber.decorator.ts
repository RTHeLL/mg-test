import { parsePhoneNumberFromString } from 'libphonenumber-js';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsPhoneNumber(
  countries: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [countries],
      validator: PhoneNumberConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsPhoneNumber' })
export class PhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (typeof value !== 'string') return false;

    const [validCountries] = args.constraints;
    const parsed = parsePhoneNumberFromString(value);

    return validCountries.includes(parsed?.country);
  }
}
