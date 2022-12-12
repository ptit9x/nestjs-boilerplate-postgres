import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1661224228702 implements MigrationInterface {
  name = 'CreateUser1661224228702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."user" (
        id bigserial NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now(),
        deleted_at timestamp NULL,
        "name" varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        "password" varchar(200) NOT NULL,
        "type" public.user_type_enum NOT NULL,
        is_administrator bool NOT NULL DEFAULT false,
        status public.user_status_enum NOT NULL DEFAULT '1'::user_status_enum,
        created_by int8 NULL,
        phone varchar(14) NULL,
        last_login timestamp NULL,
        role_id int4 NULL,
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
        CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE (name),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email),
        CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY (role_id) REFERENCES public.roles(id)
    );
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD CONSTRAINT \`FK_fb2e442d14add3cefbdf33c4561\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_fb2e442d14add3cefbdf33c4561\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`user\`
        `);
  }
}
