import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1661224228702 implements MigrationInterface {
  name = 'CreateUser1661224228702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_gender_enum" AS ENUM ('1', '2');
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
        "name" varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        "password" varchar(200) NOT NULL,
        status "user_status_enum" NOT NULL DEFAULT '1'::user_status_enum,
        created_by int8 NULL,
        phone varchar(14) NULL,
        last_login timestamp NULL,
        current_hashed_refresh_token varchar NULL,
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
        CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE (name),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE user_role (
        user_id int8 NOT NULL,
        role_id int4 NOT NULL,
        CONSTRAINT "PK_f634684acb47c1a158b83af5150" PRIMARY KEY (user_id, role_id),
        CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY (role_id) REFERENCES "role"(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_32a6fc2fcb019d8e3a8ace0f55" ON user_role USING btree (role_id);
      CREATE INDEX "IDX_d0e5815877f7395a198a4cb0a4" ON user_role USING btree (user_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE \"user_role\"
    `);
    await queryRunner.query(`
      DROP TABLE \"user\"
    `);
    await queryRunner.query(`
      DROP TYPE "user_gender_enum";
    `);
    await queryRunner.query(`
      DROP TYPE "user_status_enum";
    `);
  }
}
