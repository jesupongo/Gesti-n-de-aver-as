import { PartialType } from '@nestjs/mapped-types';
import { CreateAveriaDto } from './create-averia.dto';

export class UpdateAveriaDto extends PartialType(CreateAveriaDto) {}
