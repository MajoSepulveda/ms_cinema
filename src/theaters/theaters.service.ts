import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TheaterDto } from './dto/theater.dto';
import { TheaterResponseDto } from './dto/theater-response.dto';
import { Theater } from './entities/theater.entity';
import { TheaterMapper } from './mappers/theater.mapper';
import { TheatersRepository } from './repositories/theaters.repository';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater) // Permite usar el repository
    private readonly theatersRepository: Repository<Theater>,  // Es propio de TypeORM y permite hacer consutlas genéricas. Contiene todas las funcionalidades básicas de una base de datos.
    private readonly customTheatersRepository: TheatersRepository, // Permite hacer consultas personalizadas usando como base el repository de TypeORM. 
    private readonly theaterMapper: TheaterMapper,
  ) {}

  async create(dto: TheaterDto): Promise<TheaterResponseDto> {
    if (dto.location === undefined || dto.capacity === undefined) {
      throw new BadRequestException(
        'location and capacity are required for create',
      );
    }

    const entity = this.theaterMapper.toEntity(dto);
    const saved = await this.theatersRepository.save(entity); // las palabras async y await se usan porque node puuede usar múltiples núcleos de la CPU para la ejecución del servicio/ Permiten sincornizacíon: await espera a que se ejecute la función save en la base de datos y luego continua con la ejecución del código. 
    return this.theaterMapper.toResponseDto(saved);
  }

  async findAll(): Promise<TheaterResponseDto[]> {
    const theaters = await this.theatersRepository.find();
    return this.theaterMapper.toResponseDtoList(theaters);
  }

  async findOne(id: number): Promise<TheaterResponseDto> {
    const theater = await this.theatersRepository.findOne({ where: { id } });
    if (!theater) {
      throw new NotFoundException(`Theater with id ${id} not found`);
    }
    return this.theaterMapper.toResponseDto(theater);
  }

  async update(
    id: number,
    dto: TheaterDto,
  ): Promise<TheaterResponseDto> {
    const theater = await this.theatersRepository.findOne({ where: { id } });
    if (!theater) {
      throw new NotFoundException(`Theater with id ${id} not found`);
    }

    const merged = this.theaterMapper.mergeEntity(theater, dto);
    const saved = await this.theatersRepository.save(merged);
    return this.theaterMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const theater = await this.theatersRepository.findOne({ where: { id } });
    if (!theater) {
      throw new NotFoundException(`Theater with id ${id} not found`);
    }

    await this.theatersRepository.remove(theater);
    return { message: `Theater #${id} deleted successfully` };
  }

  async getLargeTheatersReport(
    minCapacity: number,
  ): Promise<TheaterResponseDto[]> {
    const rows =
      await this.customTheatersRepository.findLargeTheatersReport(minCapacity);
    return this.theaterMapper.toResponseDtoList(rows);
  }
}
