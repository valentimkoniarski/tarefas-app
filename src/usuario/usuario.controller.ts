import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  HttpCode,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import {
  CreateUsuarioDto,
  ResponseUsuarioDto,
  UpdateUsuarioDto,
} from './dto/_index';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Representacao,
  RepresentacaoLista,
} from '../core/decorators/representacao.decorator';
//import { JwtGuarda } from '../autenticacao/jwt.guard';
import { IdDto } from 'src/core/dto/id.dto';

@ApiTags('Usuários')
@Controller('usuarios')
//@UseGuards(JwtGuarda)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @HttpCode(201)
  @Representacao(ResponseUsuarioDto)
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

  @Put(':id')
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiNoContentResponse({ description: 'Usuário atualizado com sucesso' })
  update(@Param() params: IdDto, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.update(params.id, dto);
  }

  @Get()
  @RepresentacaoLista(ResponseUsuarioDto)
  fetch(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 20,
    @Query('termo') termo: string,
  ) {
    return this.usuarioService.findAll({
      page: Math.max(page, 0),
      limit: Math.max(limit, 1),
      termo,
    });
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @Representacao(ResponseUsuarioDto)
  findOne(@Param() params: IdDto) {
    return this.usuarioService.findOne(params.id);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Usuário removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  delete(@Param() params: IdDto) {
    return this.usuarioService.delete(params.id);
  }
}
