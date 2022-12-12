import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1661224228702 implements MigrationInterface {
  name = 'CreateUser1661224228702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(100) NOT NULL,
                \`type\` enum ('1', '2') NOT NULL,
                \`is_administrator\` tinyint NOT NULL DEFAULT 0,
                \`status\` enum ('1', '0') NOT NULL DEFAULT '1',
                \`created_by\` bigint NULL,
                \`country\` varchar(255) NULL,
                \`city\` varchar(255) NULL,
                \`postal_code\` int NULL,
                \`phone\` varchar(15) NULL,
                \`expired_date\` varchar(50) NULL,
                \`role_id\` bigint NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp(6) NULL,
                UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
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
