CREATE TABLE "order_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"orderId" integer NOT NULL,
	"productId" integer NOT NULL,
	"productName" varchar(255) NOT NULL,
	"productPrice" integer NOT NULL,
	"quantity" integer NOT NULL,
	"lineTotal" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"address" varchar(255) NOT NULL,
	"apartment" varchar(100),
	"city" varchar(100) NOT NULL,
	"province" varchar(100) NOT NULL,
	"zipCode" varchar(20) NOT NULL,
	"shippingMethod" varchar(50) NOT NULL,
	"paymentMethod" varchar(50) NOT NULL,
	"subtotal" integer NOT NULL,
	"shippingCost" integer NOT NULL,
	"tax" integer NOT NULL,
	"total" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"orderText" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;