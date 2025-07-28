CREATE TABLE "rkas_activities" (
	"id" varchar PRIMARY KEY NOT NULL,
	"standard_id" varchar NOT NULL,
	"kode_giat" text,
	"nama_giat" text NOT NULL,
	"subtitle" text,
	"kode_dana" text NOT NULL,
	"nama_dana" text NOT NULL,
	"tw1" numeric NOT NULL,
	"tw2" numeric NOT NULL,
	"tw3" numeric NOT NULL,
	"tw4" numeric NOT NULL,
	"total" numeric NOT NULL,
	"realisasi" numeric NOT NULL,
	"tanggal" timestamp,
	"no_pesanan" text,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rkas_budget_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity" varchar(500) NOT NULL,
	"bidang" varchar(255) NOT NULL,
	"standard" varchar(500) NOT NULL,
	"allocated_budget" numeric(15, 2) NOT NULL,
	"used_budget" numeric(15, 2) DEFAULT '0' NOT NULL,
	"remaining_budget" numeric(15, 2) NOT NULL,
	"quarter" varchar(10),
	"month" integer,
	"year" integer NOT NULL,
	"status" varchar(50) DEFAULT 'on-track' NOT NULL,
	"responsible" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"period_type" varchar(20) DEFAULT 'quarterly' NOT NULL,
	"selected_quarter" varchar(10),
	"selected_month" integer,
	"selected_year" integer DEFAULT 2025 NOT NULL,
	"last_used_page" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"full_name" text,
	"role" varchar DEFAULT 'viewer' NOT NULL,
	"school_name" text,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;