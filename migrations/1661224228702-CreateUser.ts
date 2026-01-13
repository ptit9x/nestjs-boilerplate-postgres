import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1661224228702 implements MigrationInterface {
  name = 'CreateUser1661224228702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_gender_enum" AS ENUM ('1', '2', '3');
    `);
    await queryRunner.query(`
      CREATE TYPE "user_status_enum" AS ENUM ('1', '2', '3', '4');
    `);
    await queryRunner.query(`
      CREATE TABLE "user" (
        id bigserial NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now(),
        deleted_at timestamp NULL,
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(200) NOT NULL,
        status "user_status_enum" NOT NULL DEFAULT '1'::user_status_enum,
        created_by int8 NULL,
        phone varchar(14) NULL,
        user_agent varchar(255) NULL,
        ip_address varchar(255) NULL,
        last_login timestamp NULL,
        current_hashed_refresh_token varchar NULL,
        role_id serial4 NOT NULL,
        avatar varchar(1000) NULL,
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email)
      );
    `);

    await queryRunner.query(`
      ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS user;
    `);
    await queryRunner.query(`
      DROP TYPE IF EXISTS "user_gender_enum";
    `);
    await queryRunner.query(`
      DROP TYPE IF EXISTS "user_status_enum";
    `);
  }
}
