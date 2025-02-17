import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsMongoId()
  @IsNotEmpty()
  user_id: string;
}
