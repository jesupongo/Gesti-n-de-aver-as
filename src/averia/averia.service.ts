import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Averia } from './entities/averia.entity';
import { EstadoAveria } from './enums/estados.enum';
import { ValoracionAveria } from './enums/valoracion.enum';
import { RolUsuario } from 'src/user/enum/rol.enum';

@Injectable()
export class AveriaService {
  constructor(
    @InjectRepository(Averia)
    private averiaRepository: Repository<Averia>,
    @InjectRepository(User)
    private usuarioRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Scaffold un usuario invitado dummy para el endpoint público
    const email = 'invitado@sistema.com';
    let invitado = await this.usuarioRepository.findOne({ where: { email } });
    if (!invitado) {
      invitado = this.usuarioRepository.create({
        nombre: 'Invitado',
        email,
        password: '', // Dummy
        rol: RolUsuario.PERSONAL,
      });
      await this.usuarioRepository.save(invitado);
    }

    // Scaffold un tecnico dummy para pruebas de UI si no existen tecnicos
    const tecEmail = 'jorge@sistema.com';
    let jorge = await this.usuarioRepository.findOne({
      where: { email: tecEmail },
    });
    if (!jorge) {
      jorge = this.usuarioRepository.create({
        nombre: 'Jorge Martinez',
        email: tecEmail,
        password: '123',
        rol: RolUsuario.MANTENIMIENTO,
      });
      await this.usuarioRepository.save(jorge);
    }
  }

  async create(data: {
    nombre: string;
    tipo: string;
    ubicacion: string;
    descripcion: string;
    reportadorId?: number;
  }) {
    let reportador = await this.usuarioRepository.findOne({
      where: { email: 'invitado@sistema.com' },
    });

    if (data.reportadorId) {
      const user = await this.usuarioRepository.findOneBy({ id: data.reportadorId });
      if (user) reportador = user;
    }

    if (!reportador)
      throw new NotFoundException('Usuario reportador no encontrado');

    const averia = this.averiaRepository.create({
      ...data,
      estado: EstadoAveria.SIN_EMPEZAR,
      valoracion: ValoracionAveria.MENOR,
      reportador: reportador,
    });

    return this.averiaRepository.save(averia);
  }

  findAll() {
    return this.averiaRepository.find({
      relations: ['reparador', 'reportador'],
      order: { fecha_comunica: 'DESC' },
    });
  }

  async updateEstado(id: number, estado: EstadoAveria) {
    const averia = await this.averiaRepository.findOneBy({ id });
    if (!averia) throw new NotFoundException();

    averia.estado = estado;
    if (estado === EstadoAveria.TERMINADA) {
      averia.fecha_reparacion = new Date();
    }
    return this.averiaRepository.save(averia);
  }

  async updatePrioridad(id: number, valoracion: ValoracionAveria) {
    const averia = await this.averiaRepository.findOneBy({ id });
    if (!averia) throw new NotFoundException();

    averia.valoracion = valoracion;
    return this.averiaRepository.save(averia);
  }

  async asignarTecnico(id: number, tecnicoId: number) {
    const averia = await this.averiaRepository.findOneBy({ id });
    if (!averia) throw new NotFoundException();

    const tecnico = await this.usuarioRepository.findOneBy({ id: tecnicoId });
    if (!tecnico) throw new NotFoundException();

    averia.reparador = tecnico;
    return this.averiaRepository.save(averia);
  }

  async verificar(id: number) {
    const averia = await this.averiaRepository.findOneBy({ id });
    if (!averia) throw new NotFoundException();

    averia.verificada = true;
    return this.averiaRepository.save(averia);
  }

  getTecnicos() {
    return this.usuarioRepository.find({
      where: [
        { rol: RolUsuario.MANTENIMIENTO },
        { rol: RolUsuario.ADMINISTRADOR },
      ],
    });
  }
}
