import { WorkspaceRepository } from '@promptpilot/database'
import { ProjectRepository } from '@promptpilot/database'
import { DocumentRepository } from '@promptpilot/database'
import { logger } from '@promptpilot/shared'

export async function createDefaultWorkspace(userId: string, userEmail: string): Promise<string> {
  const existingWorkspaces = await WorkspaceRepository.listByOwner(userId, { skip: 0, take: 1 })

  if (existingWorkspaces.total > 0) {
    logger.info({ userId }, 'User already has a workspace — skipping seed')
    return existingWorkspaces.data[0].id
  }

  const ws = await WorkspaceRepository.create({
    name: 'My Workspace',
    slug: `my-workspace-${userId.slice(0, 8)}`,
    owner: { connect: { id: userId } },
    type: 'PERSONAL',
  })

  const project = await ProjectRepository.create({
    name: 'My First Project',
    slug: `first-project-${userId.slice(0, 8)}`,
    description: 'Your first PromptPilot project. Generate your first specification here.',
    workspace: { connect: { id: ws.id } },
    owner: { connect: { id: userId } },
    status: 'ACTIVE',
  })

  logger.info({ userId, workspaceId: ws.id, projectId: project.id }, 'Seed workspace created')

  return ws.id
}
