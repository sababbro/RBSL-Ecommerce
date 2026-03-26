import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260325215844 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "b2b_admin" drop constraint if exists "b2b_admin_email_unique";`);
    this.addSql(`create table if not exists "company" ("id" text not null, "name" text not null, "trade_license" text null, "vat_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "company_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_company_deleted_at" ON "company" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "b2b_admin" ("id" text not null, "email" text not null, "company_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "b2b_admin_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_b2b_admin_email_unique" ON "b2b_admin" ("email") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_b2b_admin_company_id" ON "b2b_admin" ("company_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_b2b_admin_deleted_at" ON "b2b_admin" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "b2b_admin" add constraint "b2b_admin_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "b2b_admin" drop constraint if exists "b2b_admin_company_id_foreign";`);

    this.addSql(`drop table if exists "company" cascade;`);

    this.addSql(`drop table if exists "b2b_admin" cascade;`);
  }

}
