import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissions1661154835736 implements MigrationInterface {
  name = 'CreatePermissions1661154835736';

  // Create the 'permission' table with unique name constraint
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permission (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);
  }

  // Drop the 'permission' table
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS permission;
    `);
  }
}
