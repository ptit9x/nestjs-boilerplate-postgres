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
            CREATE TABLE \`role_permission\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`role_id\` bigint NOT NULL,
                \`permission_id\` bigint NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`role_permission\`
            ADD CONSTRAINT \`FK_3d0a7155eafd75ddba5a7013368\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`role_permission\`
            ADD CONSTRAINT \`FK_e3a3ba47b7ca00fd23be4ebd6cf\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3a3ba47b7ca00fd23be4ebd6cf\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_3d0a7155eafd75ddba5a7013368\`
        `);
    await queryRunner.query(`
            DROP TABLE \`role_permission\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\`
        `);
    await queryRunner.query(`
            DROP TABLE \`roles\`
        `);
  }
}
