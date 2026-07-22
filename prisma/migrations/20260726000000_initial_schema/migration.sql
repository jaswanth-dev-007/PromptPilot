-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE "WorkspaceType" AS ENUM ('PERSONAL', 'TEAM');
CREATE TYPE "WorkspaceStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "WorkspaceRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "DocumentType" AS ENUM ('MASTER_CONTEXT', 'PRD', 'SRS', 'ARCHITECTURE', 'DATABASE', 'API_SPEC', 'USER_FLOWS', 'WIREFRAMES', 'ROADMAP');
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'GENERATED', 'REVIEWED', 'STALE');
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE "MessageRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT');
CREATE TYPE "LLMProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'GOOGLE', 'OLLAMA');
CREATE TYPE "GenerationStatus" AS ENUM ('SUCCESS', 'FAILED', 'RETRIED');
CREATE TYPE "ExportFormat" AS ENUM ('PDF', 'MARKDOWN', 'HTML', 'DOCX');
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE "NotificationType" AS ENUM ('PIPELINE_COMPLETED', 'GENERATION_FAILED', 'MEMBER_INVITED', 'DOCUMENT_REVIEWED', 'EXPORT_COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "refresh_token_hash" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");

CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "type" "WorkspaceType" NOT NULL DEFAULT 'PERSONAL',
    "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "workspaces_owner_id_slug_key" ON "workspaces"("owner_id", "slug");
CREATE INDEX "workspaces_status_idx" ON "workspaces"("status");

ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "workspace_members" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'EDITOR',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "workspace_members_workspace_id_user_id_key" ON "workspace_members"("workspace_id", "user_id");
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members"("user_id");

ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "workspace_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "projects_workspace_id_slug_key" ON "projects"("workspace_id", "slug");
CREATE INDEX "projects_owner_id_idx" ON "projects"("owner_id");
CREATE INDEX "projects_status_idx" ON "projects"("status");

ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "model" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "max_tokens" INTEGER NOT NULL DEFAULT 16000,
    "total_input_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_output_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_conversations_project_id_step_id_idx" ON "ai_conversations"("project_id", "step_id");
CREATE INDEX "ai_conversations_project_id_status_idx" ON "ai_conversations"("project_id", "status");

ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "tokens" INTEGER,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "messages_conversation_id_sequence_key" ON "messages"("conversation_id", "sequence");

ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "generations" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "provider" "LLMProvider" NOT NULL,
    "prompt_tokens" INTEGER NOT NULL,
    "completion_tokens" INTEGER NOT NULL,
    "total_tokens" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "status" "GenerationStatus" NOT NULL,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "generations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "generations_conversation_id_idx" ON "generations"("conversation_id");
CREATE INDEX "generations_created_at_idx" ON "generations"("created_at");

ALTER TABLE "generations" ADD CONSTRAINT "generations_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "content" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "conversation_id" TEXT NOT NULL,
    "tokens_used" INTEGER,
    "model_used" TEXT,
    "stale" BOOLEAN NOT NULL DEFAULT false,
    "stale_reason" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "documents_project_id_step_id_key" ON "documents"("project_id", "step_id");
CREATE INDEX "documents_project_id_type_idx" ON "documents"("project_id", "type");
CREATE INDEX "documents_conversation_id_idx" ON "documents"("conversation_id");
CREATE INDEX "documents_status_idx" ON "documents"("status");

ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "ai_conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "document_versions" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "model_used" TEXT,
    "tokens_used" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_versions_document_id_version_number_key" ON "document_versions"("document_id", "version_number");

ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "exports" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "status" "ExportStatus" NOT NULL DEFAULT 'PENDING',
    "file_url" TEXT,
    "file_size" INTEGER,
    "document_ids" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "exports_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "exports_project_id_idx" ON "exports"("project_id");
CREATE INDEX "exports_status_idx" ON "exports"("status");

ALTER TABLE "exports" ADD CONSTRAINT "exports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "project_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notifications_user_id_read_idx" ON "notifications"("user_id", "read");
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "api_keys_workspace_id_idx" ON "api_keys"("workspace_id");
CREATE INDEX "api_keys_key_hash_idx" ON "api_keys"("key_hash");

ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
