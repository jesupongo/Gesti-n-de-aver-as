import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './decorators/role.decorator';
import { RolUsuario } from './enum/rol.enum';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('login')
  login(@Body() loginDto: Record<string, any>) {
    return this.usersService.login(loginDto.email, loginDto.password);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
