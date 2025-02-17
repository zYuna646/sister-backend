import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nisn: string;

  @IsMongoId()
  @IsNotEmpty()
  school_id: string;

  @IsMongoId()
  @IsNotEmpty()
  user_id: string;
}
