ALTER TABLE "orders" ADD COLUMN "accessToken" varchar(64);--> statement-breakpoint
UPDATE "orders" SET "accessToken" = encode(gen_random_bytes(32), 'hex') WHERE "accessToken" IS NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "accessToken" SET NOT NULL;