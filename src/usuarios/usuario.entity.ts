import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Averia } from '../averias/averia.entity';

export enum RolUsuario {
  ADMINISTRADOR = 'ADMINISTRADOR',
  MANTENIMIENTO = 'MANTENIMIENTO',
  PERSONAL = 'PERSONAL',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string; // Solo como demostracion

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.PERSONAL,
  })
  rol: RolUsuario;

  // Single Table Inheritance fields
  @Column({ nullable: true })
  oficio: string;

  @Column({ nullable: true })
  especialidad: string;

  @OneToMany(() => Averia, averia => averia.reportador)
  averiasReportadas: Averia[];

  @OneToMany(() => Averia, averia => averia.reparador)
  averiasAsignadas: Averia[];
}
