import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1661161731016 implements MigrationInterface {
  name = 'CreateRoles1661161731016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create role_status_enum type if not exists
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_status_enum') THEN
          CREATE TYPE role_status_enum AS ENUM ('1', '2');
        END IF;
      END$$;
    `);
    // Create role_type_enum type if not exists
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type_enum') THEN
          CREATE TYPE role_type_enum AS ENUM ('1', '2', '3', '4', '5');
        END IF;
      END$$;
    `);
    // Create role table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        type role_type_enum NOT NULL,
        created_by BIGINT,
        status role_status_enum NOT NULL DEFAULT '1'
      );
    `);
    // Create role_permission table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permission (
        role_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_permission FOREIGN KEY (permission_id) REFERENCES permission(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    // Create indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_role_permission_role_id ON role_permission (role_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_role_permission_permission_id ON role_permission (permission_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS role_permission;
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS role;
    `);
    await queryRunner.query(`
      DROP TYPE IF EXISTS role_status_enum;
    `);
    await queryRunner.query(`
      DROP TYPE IF EXISTS role_type_enum;
    `);
  }
}
