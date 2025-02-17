import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsMongoId()
  @IsOptional()
  user_id?: string;
}
