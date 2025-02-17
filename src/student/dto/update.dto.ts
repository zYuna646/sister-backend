import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  nisn?: string;

  @IsMongoId()
  @IsOptional()
  school_id?: string;

  @IsMongoId()
  @IsOptional()
  user_id?: string;
}
