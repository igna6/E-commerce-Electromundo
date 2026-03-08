ALTER TABLE "orders" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "province" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "zipCode" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shippingMethod" SET DEFAULT 'pickup';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shippingMethod" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shippingCost" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sku" varchar;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sku_unique" UNIQUE("sku");