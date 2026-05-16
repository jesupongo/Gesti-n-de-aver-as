import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { EstadoAveria } from '../enums/estados.enum';
import { ValoracionAveria } from '../enums/valoracion.enum';
import { User } from 'src/user/entities/user.entity';

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

  @Column({ default: false })
  verificada: boolean;

  @ManyToOne(() => User, usuario => usuario.averiasReportadas, { nullable: true, onDelete: 'SET NULL' })
  reportador: User;

  @ManyToOne(() => User, usuario => usuario.averiasAsignadas, { nullable: true, onDelete: 'SET NULL' })
  reparador: User;
}
