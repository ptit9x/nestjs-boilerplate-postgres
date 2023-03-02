import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganization1677731674992 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE organization (
        id serial4 NOT NULL,
        "name" varchar(255) NOT NULL,
        description varchar(2000) NULL,
        CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY (id),
        CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE (name)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE organization_role (
        role_id int4 NOT NULL,
        organization_id int4 NOT NULL,
        CONSTRAINT "PK_db1d53335c6367c84e71df2274f" PRIMARY KEY (role_id, organization_id),
        CONSTRAINT "FK_68da939b50b7dc10690d27d09c0" FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_f1a40c3acd944d41dc815d429a2" FOREIGN KEY (role_id) REFERENCES "role"(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_68da939b50b7dc10690d27d09c" ON organization_role USING btree (organization_id);
      CREATE INDEX "IDX_f1a40c3acd944d41dc815d429a" ON organization_role USING btree (role_id);
    `);
  await queryRunner.query(`
    CREATE TABLE user_organization (
      user_id int8 NOT NULL,
      organization_id int4 NOT NULL,
      CONSTRAINT "PK_08dd13dd12c28edb5a22e3cc095" PRIMARY KEY (user_id, organization_id),
      CONSTRAINT "FK_3380ac618acf226e1c2d6e9a228" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "FK_f2d20e8f038adda18639b2db1b8" FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    CREATE INDEX "IDX_3380ac618acf226e1c2d6e9a22" ON user_organization USING btree (user_id);
    CREATE INDEX "IDX_f2d20e8f038adda18639b2db1b" ON user_organization USING btree (organization_id);
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE \"organization_role\"
    `);
    await queryRunner.query(`
        DROP TABLE \"user_organization\"
    `);
    await queryRunner.query(`
        DROP TABLE \"organization\"
    `);
  }
}
