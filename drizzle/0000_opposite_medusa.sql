CREATE TABLE `examplet3app_account` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `examplet3app_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `examplet3app_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`created_by` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`created_by`) REFERENCES `examplet3app_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `examplet3app_project` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`projectName` text(255),
	`created_by` text(255) NOT NULL,
	`likes` integer DEFAULT 0,
	`makes` integer DEFAULT 0,
	`projectDescription` text NOT NULL,
	`category` text NOT NULL,
	`projectImage` text,
	`steps` text DEFAULT (json_array()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`created_by`) REFERENCES `examplet3app_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `examplet3app_session` (
	`session_token` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `examplet3app_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `examplet3app_step` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`projectId` text(255) NOT NULL,
	`description` text(255) NOT NULL,
	`projectImage` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`projectId`) REFERENCES `examplet3app_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `examplet3app_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT (unixepoch()),
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `examplet3app_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `examplet3app_account` (`user_id`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `examplet3app_post` (`created_by`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `examplet3app_post` (`name`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `examplet3app_session` (`userId`);