import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1661161731016 implements MigrationInterface {
  name = 'CreateRoles1661161731016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."role" (
          id serial4 NOT NULL,
          "name" varchar(255) NOT NULL,
          "type" public."role_type_enum" NOT NULL,
          created_by int8 NULL,
          CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id),
          CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name)
      );
    `);
    await queryRunner.query(`
      CREATE TABLE public.role_permission (
          role_id int4 NOT NULL,
          permission_id int4 NOT NULL,
          CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY (role_id, permission_id),
          CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY (role_id) REFERENCES public."role"(id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY (permission_id) REFERENCES public."permission"(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_3d0a7155eafd75ddba5a701336" ON public.role_permission USING btree (role_id);
      CREATE INDEX "IDX_e3a3ba47b7ca00fd23be4ebd6c" ON public.role_permission USING btree (permission_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \"role_permission\" DROP FOREIGN KEY \"FK_e3a3ba47b7ca00fd23be4ebd6cf\"
        `);
    await queryRunner.query(`
            ALTER TABLE \"role_permission\" DROP FOREIGN KEY \"FK_3d0a7155eafd75ddba5a7013368\"
        `);
    await queryRunner.query(`
            DROP TABLE \"role_permission\"
        `);
    await queryRunner.query(`
            DROP INDEX \"IDX_648e3f5447f725579d7d4ffdfb\" ON \"roles\"
        `);
    await queryRunner.query(`
            DROP TABLE \"roles\"
        `);
  }
}
