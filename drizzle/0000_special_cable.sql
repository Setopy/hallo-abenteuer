CREATE TABLE `child_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`nickname` text NOT NULL,
	`avatar` text NOT NULL,
	`progress` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `child_profiles_owner` ON `child_profiles` (`owner_id`);