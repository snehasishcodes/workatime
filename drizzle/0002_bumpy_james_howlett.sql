ALTER TABLE "projects" ADD COLUMN "sessions" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "pings";