import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1661161731016 implements MigrationInterface {
  name = 'CreateRoles1661161731016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "role_status_enum" AS ENUM (
        '1',
        '2');
    `);
    await queryRunner.query(`
      CREATE TYPE "role_type_enum" AS ENUM (
        '1',
        '2',
        '3');
    `);
    await queryRunner.query(`
      CREATE TABLE "role" (
        id serial4 NOT NULL,
        "name" varchar(255) NOT NULL,
        "type" "role_type_enum" NOT NULL,
        created_by int8 NULL,
        is_super_admin bool NOT NULL DEFAULT false,
        status "role_status_enum" NOT NULL DEFAULT '1'::role_status_enum,
        CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id),
        CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name)
      );
    `);
    await queryRunner.query(`
      CREATE TABLE role_permission (
        role_id int4 NOT NULL,
        permission_id int4 NOT NULL,
        CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY (role_id, permission_id),
        CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY (role_id) REFERENCES "role"(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY (permission_id) REFERENCES "permission"(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_3d0a7155eafd75ddba5a701336" ON role_permission USING btree (role_id);
      CREATE INDEX "IDX_e3a3ba47b7ca00fd23be4ebd6c" ON role_permission USING btree (permission_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE \"role_permission\"
    `);
    await queryRunner.query(`
      DROP TABLE \"role\"
    `);
    await queryRunner.query(`
      DROP TYPE "role_status_enum";
    `);
    await queryRunner.query(`
      DROP TYPE "role_type_enum";
    `);
  }
}
