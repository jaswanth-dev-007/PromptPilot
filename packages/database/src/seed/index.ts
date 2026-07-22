import { prisma } from '../client'
import { UserRepository } from '../repositories/user'
import { WorkspaceRepository } from '../repositories/workspace'
import { ProjectRepository } from '../repositories/project'
import { DocumentRepository } from '../repositories/document'
import { AIConversationRepository } from '../repositories/aiConversation'
import { MessageRepository } from '../repositories/message'
import { NotificationRepository } from '../repositories/notification'

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'
const DEMO_WORKSPACE_ID = '00000000-0000-0000-0000-000000000002'
const DEMO_PROJECT_ID = '00000000-0000-0000-0000-000000000003'

async function seed() {
  console.log('🌱 Seeding database...')

  const existingUser = await UserRepository.findById(DEMO_USER_ID)
  if (existingUser) {
    console.log('   ⏭️  Seed data already exists. Skipping.')
    return
  }

  // ── Demo User ──
  const user = await UserRepository.create({
    id: DEMO_USER_ID,
    email: 'demo@promptpilot.dev',
    passwordHash: '$2b$10$placeholder_hash_for_demo_user',
    name: 'Demo User',
    role: 'ADMIN',
  })
  console.log(`   ✅ User: ${user.email}`)

  // ── Personal Workspace ──
  const workspace = await WorkspaceRepository.create({
    id: DEMO_WORKSPACE_ID,
    name: 'My Workspace',
    slug: 'my-workspace',
    owner: { connect: { id: user.id } },
    type: 'PERSONAL',
    settings: { defaultModel: 'gpt-4o', defaultTemperature: 0.2 },
  })
  console.log(`   ✅ Workspace: ${workspace.name}`)

  // ── Demo Project ──
  const project = await ProjectRepository.create({
    id: DEMO_PROJECT_ID,
    name: 'PromptPilot Specification',
    slug: 'promptpilot-spec',
    description: 'Complete software specification for PromptPilot itself — built by PromptPilot.',
    workspace: { connect: { id: workspace.id } },
    owner: { connect: { id: user.id } },
    status: 'ACTIVE',
  })
  console.log(`   ✅ Project: ${project.name}`)

  // ── Master Context Document ──
  const masterContext = await DocumentRepository.create({
    id: '00000000-0000-0000-0000-000000000010',
    project: { connect: { id: project.id } },
    stepId: 'master-context',
    title: 'Master Context',
    type: 'MASTER_CONTEXT',
    content: `# Master Context — PromptPilot

## Product Vision
PromptPilot is an AI-powered SaaS platform that transforms product ideas into complete software specification suites.

## Target Audience
Software engineers, product managers, technical founders, and engineering teams.

## Platform
Web application with REST API backend.

## Industry Domain
Software engineering tools and developer productivity.`,
    status: 'GENERATED',
    version: 1,
    conversation: {
      create: {
        project: { connect: { id: project.id } },
        stepId: 'master-context',
        model: 'gpt-4o',
        status: 'COMPLETED',
        startedAt: new Date(),
        completedAt: new Date(),
      },
    },
  })
  console.log(`   ✅ Document: ${masterContext.title}`)

  // ── PRD Document ──
  const prdDoc = await DocumentRepository.create({
    id: '00000000-0000-0000-0000-000000000011',
    project: { connect: { id: project.id } },
    stepId: 'prd',
    title: 'Product Requirements Document',
    type: 'PRD',
    content: `# Product Requirements Document — PromptPilot

## Functional Requirements
1. User authentication with email/password
2. Project creation and management
3. AI-powered pipeline execution
4. Document generation and versioning

## Non-Functional Requirements
- 99.9% uptime SLA
- < 200ms API response time
- SOC 2 Type II compliance`,
    status: 'GENERATED',
    version: 1,
    conversation: {
      create: {
        project: { connect: { id: project.id } },
        stepId: 'prd',
        model: 'gpt-4o',
        status: 'COMPLETED',
        startedAt: new Date(),
        completedAt: new Date(),
      },
    },
  })
  console.log(`   ✅ Document: ${prdDoc.title}`)

  // ── AI Conversation ──
  const conversation = await AIConversationRepository.create({
    project: { connect: { id: project.id } },
    stepId: 'srs',
    model: 'claude-3-5-sonnet-20241022',
    status: 'COMPLETED',
    temperature: 0.2,
    maxTokens: 16000,
    startedAt: new Date(Date.now() - 300000),
    completedAt: new Date(),
    totalInputTokens: 4520,
    totalOutputTokens: 8230,
    totalCost: 0.41,
  })
  console.log(`   ✅ Conversation: ${conversation.stepId}`)

  // ── Messages ──
  await MessageRepository.createMany([
    {
      conversationId: conversation.id,
      role: 'SYSTEM',
      content: 'You are a software requirements expert...',
      sequence: 1,
      tokens: 120,
    },
    {
      conversationId: conversation.id,
      role: 'USER',
      content: 'Generate an SRS for PromptPilot based on the PRD and Master Context.',
      sequence: 2,
      tokens: 4400,
    },
    {
      conversationId: conversation.id,
      role: 'ASSISTANT',
      content: '# Software Requirements Specification...',
      sequence: 3,
      tokens: 8230,
    },
  ])
  console.log('   ✅ Messages: 3')

  // ── Notification ──
  await NotificationRepository.create({
    user: { connect: { id: user.id } },
    type: 'PIPELINE_COMPLETED',
    title: 'Pipeline Completed',
    body: 'Your PromptPilot Specification pipeline has completed. 2 documents generated.',
    projectId: project.id,
  })
  console.log('   ✅ Notification: Pipeline Completed')

  console.log('\n🎉 Seed complete!')
  console.log(`   Demo login: demo@promptpilot.dev`)
}

seed()
  .catch(e => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
