import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function PasswordMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'PasswordMatch', // Tên của decorator.
      target: object.constructor, // Loại đối tượng mà decorator sẽ được áp dụng
      propertyName: propertyName, // Tên của thuộc tính mà decorator sẽ được áp dụng.
      constraints: [property], // Một mảng các ràng buộc
      options: validationOptions, // Các tùy chọn cho quy tắc kiểm tra. Đây là tùy chọn và có thể bỏ qua
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName]: string[] = args.constraints; // Lấy tên của thuộc tính cần so sánh
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'string' &&
            typeof value === 'string' &&
            relatedValue === value
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}
