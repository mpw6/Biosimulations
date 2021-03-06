import {
  License,
  LicenseInfo as ILicenseInfo,
} from '@biosimulations/datamodel/core';
import { ApiProperty } from '@nestjs/swagger';

export class LicenseInfo implements ILicenseInfo {
  @ApiProperty({ enum: License })
  value!: License;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  version!: string;
  @ApiProperty()
  swoId!: number;
  @ApiProperty()
  url!: string;
}
