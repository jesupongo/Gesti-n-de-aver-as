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

  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['averiasReportadas'],
    });
  }

  
  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }

  
  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no existe`);
    }

    
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return await this.userRepository.save(user);
  }

  
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (user && user.email === 'invitado@sistema.com') {
      throw new ConflictException('No se puede eliminar el usuario de sistema (Sin Registrar)');
    }
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  
  async login(email: string, pass: string) {
    const user = await this.userRepository.findOneBy({ email });
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    
    const isMatch = await bcrypt.compare(pass, user.password!);
    
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    
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