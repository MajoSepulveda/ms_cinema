import { Injectable } from '@nestjs/common';
import { TheaterDto } from '../dto/theater.dto';
import { TheaterResponseDto } from '../dto/theater-response.dto';
import { Theater } from '../entities/theater.entity';

@Injectable()
export class TheaterMapper {
  toEntity(dto: TheaterDto): Theater { // Pasar de DTO a Entity
    const theater = new Theater();
    theater.location = dto.location!;
    theater.capacity = dto.capacity!;
    return theater;
  }

  mergeEntity(entity: Theater, dto: TheaterDto): Theater { // Sirve para actualizar un entity con los datos del DTO.
    if (dto.location !== undefined) entity.location = dto.location;
    if (dto.capacity !== undefined) entity.capacity = dto.capacity;
    return entity;
  }

  toResponseDto(entity: Theater): TheaterResponseDto { // Pasar de Entity a Response DTO
    return {
      id: entity.id,
      location: entity.location,
      capacity: entity.capacity,
    };
  }

  toResponseDtoList(entities: Theater[]): TheaterResponseDto[] { // Pasar la lista de entity a DTO
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
