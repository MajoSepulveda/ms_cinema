import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('theaters') // declara la tabla para la base de datos
export class Theater {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  location!: string;

  @Column({ type: 'int' })
  capacity!: number;
}
