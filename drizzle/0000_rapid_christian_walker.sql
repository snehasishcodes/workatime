CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255),
	"icon" text,
	"minutes_spent" integer,
	"pings" integer,
	"last_ping" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"avatar" text,
	"access_token" varchar(512) NOT NULL,
	"created" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;