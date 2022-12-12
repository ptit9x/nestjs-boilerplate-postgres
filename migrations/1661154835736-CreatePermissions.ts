import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissions1661154835736 implements MigrationInterface {
  name = 'CreatePermissions1661154835736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`permissions\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp(6) NULL,
                UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\`
        `);
    await queryRunner.query(`
            DROP TABLE \`permissions\`
        `);
  }
}
