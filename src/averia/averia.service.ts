import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Averia } from './entities/averia.entity';
import { EstadoAveria } from './enums/estados.enum';
import { ValoracionAveria } from './enums/valoracion.enum';
import { RolUsuario } from 'src/user/enum/rol.enum';
import { CreateAveriaDto } from './dto/create-averia.dto';

@Injectable()
export class AveriaService {
  constructor(
    @InjectRepository(Averia)
    private averiaRepository: Repository<Averia>,
    @InjectRepository(User)
    private usuarioRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    
    const email = 'invitado@sistema.com';
    let invitado = await this.usuarioRepository.findOne({ where: { email } });
    if (!invitado) {
      invitado = this.usuarioRepository.create({
        nombre: 'Sin Registrar',
        email,
        password: '', 
        rol: RolUsuario.PERSONAL,
      });
      await this.usuarioRepository.save(invitado);
    } else if (invitado.nombre !== 'Sin Registrar') {
      invitado.nombre = 'Sin Registrar';
      await this.usuarioRepository.save(invitado);
    }

    
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

  async create(createAveriaDto: CreateAveriaDto) {
    console.log('--- CREATING AVERIA ---');
    console.log('Incoming DTO:', createAveriaDto);
    const { reportadorId, ...rest } = createAveriaDto;

    let reportador = await this.usuarioRepository.findOne({
      where: { email: 'invitado@sistema.com' },
    });

    if (reportadorId && reportadorId !== 'null' && reportadorId !== 'undefined') {
      const id = typeof reportadorId === 'string' ? parseInt(reportadorId) : reportadorId;
      if (!isNaN(id)) {
        const user = await this.usuarioRepository.findOneBy({ id: id as any });
        if (user) reportador = user;
      }
    }

    if (!reportador) {
      console.error('ERROR: Reportador not found!');
      throw new NotFoundException('Usuario reportador no encontrado (Sin Registrar no inicializado)');
    }

    const averia = this.averiaRepository.create({
      ...rest,
      estado: rest.estado || EstadoAveria.SIN_EMPEZAR,
      valoracion: rest.valoracion || ValoracionAveria.MENOR,
      reportador: reportador,
    });

    console.log('Saving Averia:', averia);
    const saved = await this.averiaRepository.save(averia);
    console.log('Saved successfully with ID:', saved.id);
    return saved;
  }

  findAll() {
    return this.averiaRepository.find({
      relations: ['reparador', 'reportador'],
      order: { fecha_comunica: 'DESC' },
    });
  }

  async updateEstado(id: number, estado: EstadoAveria) {
    console.log(`Updating Averia ${id} status to: ${estado}`);
    const averia = await this.averiaRepository.findOneBy({ id });
    if (!averia) throw new NotFoundException('Avería no encontrada');

    averia.estado = estado;
    if (estado === EstadoAveria.TERMINADA) {
      averia.fecha_reparacion = new Date();
    }
    const result = await this.averiaRepository.save(averia);
    console.log(`Averia ${id} updated successfully`);
    return result;
  }

  async updatePrioridad(id: number, valoracion: ValoracionAveria) {
    console.log(`Updating Averia ${id} priority to: ${valoracion}`);
    const averia = await this.averiaRepository.findOneBy({ id });
    if (!averia) throw new NotFoundException('Avería no encontrada');

    averia.valoracion = valoracion;
    const result = await this.averiaRepository.save(averia);
    console.log(`Averia ${id} priority updated`);
    return result;
  }

  async asignarTecnico(id: number, tecnicoId: number) {
    console.log(`Assigning Averia ${id} to technician: ${tecnicoId}`);
    const averia = await this.averiaRepository.findOne({ where: { id }, relations: ['reparador'] });
    if (!averia) throw new NotFoundException('Avería no encontrada');

    if (!tecnicoId || isNaN(tecnicoId)) {
      averia.reparador = null;
    } else {
      const tecnico = await this.usuarioRepository.findOneBy({ id: tecnicoId });
      if (!tecnico) throw new NotFoundException('Técnico no encontrado');
      averia.reparador = tecnico;
    }

    const result = await this.averiaRepository.save(averia);
    console.log(`Averia ${id} assigned successfully`);
    return result;
  }

  async verificar(id: number) {
    console.log(`Verifying/Publishing Averia ${id}`);
    const averia = await this.averiaRepository.findOneBy({ id });
    if (!averia) throw new NotFoundException('Avería no encontrada');

    averia.verificada = true;
    const result = await this.averiaRepository.save(averia);
    console.log(`Averia ${id} verified and published`);
    return result;
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
