import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1661161731016 implements MigrationInterface {
  name = 'CreateRoles1661161731016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public.roles (
        id serial4 NOT NULL,
        "name" varchar(255) NOT NULL,
        "type" public.roles_type_enum NOT NULL,
        created_by int8 NULL,
        CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id),
        CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name)
    );
        `);
    await queryRunner.query(`
        CREATE TABLE public.role_permission (
        id serial4 NOT NULL,
        role_id int4 NOT NULL,
        permission_id int4 NOT NULL,
        CONSTRAINT "PK_96c8f1fd25538d3692024115b47" PRIMARY KEY (id),
        CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY (role_id) REFERENCES public.roles(id),
        CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY (permission_id) REFERENCES public.permissions(id)
    );
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
