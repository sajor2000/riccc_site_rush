CREATE TYPE "public"."review_status" AS ENUM('new', 'reviewed', 'shortlisted', 'declined');--> statement-breakpoint
CREATE TABLE "internship_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cycle_year" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"school" text NOT NULL,
	"degree_level" text NOT NULL,
	"major" text NOT NULL,
	"graduation" text NOT NULL,
	"availability_start" text NOT NULL,
	"availability_end" text NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills_other" text DEFAULT '' NOT NULL,
	"why_riccc" text NOT NULL,
	"experience" text NOT NULL,
	"resume_url" text NOT NULL,
	"portfolio_url" text DEFAULT '' NOT NULL,
	"heard_about" text DEFAULT '' NOT NULL,
	"submitted_ip" text,
	"resend_message_id" text,
	"review_status" "review_status" DEFAULT 'new' NOT NULL,
	"internal_notes" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX "internship_applications_cycle_created_idx" ON "internship_applications" USING btree ("cycle_year","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "internship_applications_email_cycle_idx" ON "internship_applications" USING btree ("email","cycle_year");