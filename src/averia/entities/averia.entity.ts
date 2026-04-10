import { PrimaryGeneratedColumn } from 'typeorm';

export class Averia {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
