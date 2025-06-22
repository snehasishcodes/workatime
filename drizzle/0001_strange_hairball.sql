ALTER TABLE "projects" ALTER COLUMN "minutes_spent" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "minutes_spent" SET DEFAULT '0.00';