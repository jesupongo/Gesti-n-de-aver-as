import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 1. Crear Usuario (con Hash de password)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  // 2. Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // 3. Buscar por Correo
  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }

  // 4. Actualizar Usuario
  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no existe`);
    }

    // Si se actualiza el password, hay que re-hashearlo
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return await this.userRepository.save(user);
  }

  // 5. Eliminar Usuario
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  // 6. Verificación de Inicio de Sesión (Login)
  async login(email: string, pass: string) {
    const user = await this.userRepository.findOneBy({ email });
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar contraseña enviada con el hash de la DB
    const isMatch = await bcrypt.compare(pass, user.password!);
    
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar el JWT
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol
      }
    };
  }
}