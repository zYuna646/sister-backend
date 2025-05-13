import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDtoLandingSchools {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'School ID reference',
    example: '60a6c5ec0f16d826d864f292',
  })
  school_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Message from the school principal',
    example: 'Welcome to our school...',
    required: false,
  })
  principal_message?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'URL to the principal photo',
    example: 'uploads/landing-schools/principal-123.jpg',
    required: false,
  })
  principal_photo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'URL to the hero image for the school landing page',
    example: 'uploads/landing-schools/hero-123.jpg',
    required: false,
  })
  hero_image?: string;
}
