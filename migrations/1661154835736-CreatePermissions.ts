import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissions1661154835736 implements MigrationInterface {
  name = 'CreatePermissions1661154835736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."permission" (
        id serial4 NOT NULL,
        name varchar(255) NOT NULL,
        CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY (id),
        CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE (name)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE \"permissions\"
    `);
  }
}
