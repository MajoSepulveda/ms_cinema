import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTheatersTable1761480000000 implements MigrationInterface {
  name = 'CreateTheatersTable1761480000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('theaters');
    if (hasTable) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'theaters',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'location',
            type: 'varchar',
            length: '120',
          },
          {
            name: 'capacity',
            type: 'int',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('theaters');
    if (hasTable) {
      await queryRunner.dropTable('theaters');
    }
  }
}
