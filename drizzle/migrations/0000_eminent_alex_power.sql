CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"phone" text NOT NULL,
	"address" text,
	"user_id" integer NOT NULL,
	CONSTRAINT "contacts_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;