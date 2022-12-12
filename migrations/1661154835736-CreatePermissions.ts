import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissions1661154835736 implements MigrationInterface {
  name = 'CreatePermissions1661154835736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.permissions (
      id serial4 NOT NULL,
      "name" varchar(255) NOT NULL,
      CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY (id),
      CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE (name)
    );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \"IDX_48ce552495d14eae9b187bb671\" ON \"permissions\"
        `);
    await queryRunner.query(`
            DROP TABLE \"permissions\"
        `);
  }
}
