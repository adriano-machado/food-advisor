import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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

export class WhatsAppStatusDto {
  @IsString()
  id: string;

  @IsString()
  status: string;

  @IsString()
  timestamp: string;

  @IsString()
  recipient_id: string;

  @IsObject()
  conversation: {
    id: string;
    origin: {
      type: string;
    };
    expiration_timestamp?: string;
  };

  @IsObject()
  pricing: {
    billable: boolean;
    pricing_model: string;
    category: string;
  };
}

export class WhatsAppMetadataDto {
  @IsString()
  display_phone_number: string;

  @IsString()
  phone_number_id: string;
}

export class WebhookValueDto {
  @IsString()
  messaging_product: string;

  @ValidateNested()
  @Type(() => WhatsAppMetadataDto)
  metadata: WhatsAppMetadataDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppMessageDto)
  messages?: WhatsAppMessageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppStatusDto)
  statuses?: WhatsAppStatusDto[];
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
