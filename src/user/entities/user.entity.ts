import { Averia } from 'src/averia/entities/averia.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RolUsuario } from '../enum/rol.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.PERSONAL,
  })
  rol: RolUsuario;

  @Column({ nullable: true })
  oficio: string;

  @Column({ nullable: true })
  especialidad: string;

  @OneToMany(() => Averia, (averia) => averia.reportador)
  averiasReportadas: Averia[];

  @OneToMany(() => Averia, (averia) => averia.reparador)
  averiasAsignadas: Averia[];
}
