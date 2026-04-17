import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

export enum EstadoAveria {
  SIN_EMPEZAR = 'SIN_EMPEZAR',
  EN_REPARACION = 'EN_REPARACION',
  TERMINADA = 'TERMINADA',
}

export enum ValoracionAveria {
  CRITICA = 'CRITICA',
  MENOR = 'MENOR',
  ACUMULABLE = 'ACUMULABLE',
}

@Entity()
export class Averia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column({
    type: 'enum',
    enum: ValoracionAveria,
    default: ValoracionAveria.MENOR,
  })
  valoracion: ValoracionAveria;

  @Column({
    type: 'enum',
    enum: EstadoAveria,
    default: EstadoAveria.SIN_EMPEZAR,
  })
  estado: EstadoAveria;

  @Column({ nullable: true })
  fecha_reparacion: Date;

  @CreateDateColumn()
  fecha_comunica: Date;

  @Column()
  ubicacion: string;

  @Column('text')
  descripcion: string;

  @ManyToOne(() => Usuario, usuario => usuario.averiasReportadas, { nullable: true })
  reportador: Usuario;

  @ManyToOne(() => Usuario, usuario => usuario.averiasAsignadas, { nullable: true })
  reparador: Usuario;
}
