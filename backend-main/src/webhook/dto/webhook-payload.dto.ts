import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class WhatsAppMessageTextDto {
  @IsString()
  body: string;
}

export class WhatsAppMessageImageDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  url: string;
}

export class WhatsAppMessageDto {
  @IsString()
  from: string;

  @IsString()
  id: string;

  @IsString()
  timestamp: string;

  @IsString()
  type: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WhatsAppMessageTextDto)
  text?: WhatsAppMessageTextDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WhatsAppMessageImageDto)
  image?: WhatsAppMessageImageDto;
}

export class WebhookValueDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppMessageDto)
  messages?: WhatsAppMessageDto[];
}

export class WebhookChangeDto {
  @ValidateNested()
  @Type(() => WebhookValueDto)
  value: WebhookValueDto;

  @IsString()
  field: string;
}

export class WebhookEntryDto {
  @IsString()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookChangeDto)
  changes: WebhookChangeDto[];
}

export class WebhookPayloadDto {
  @IsString()
  object: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookEntryDto)
  entry: WebhookEntryDto[];
}
