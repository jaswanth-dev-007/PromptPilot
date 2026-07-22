import mongoose, { type Document, type Model, Schema, type Types } from 'mongoose'

export interface IProject {
  name: string
  slug: string
  description?: string
  ownerId: Types.ObjectId
  members: Array<{
    userId: Types.ObjectId
    role: 'admin' | 'editor' | 'viewer'
  }>
  settings: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface IProjectDocument extends IProject, Document {
  _id: mongoose.Types.ObjectId
}

const projectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: undefined,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['admin', 'editor', 'viewer'],
          default: 'editor',
        },
      },
    ],
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>
        delete obj.__v
        return obj
      },
    },
  },
)

projectSchema.index({ ownerId: 1, slug: 1 }, { unique: true })
projectSchema.index({ 'members.userId': 1 })

export const Project: Model<IProjectDocument> = mongoose.model<IProjectDocument>(
  'Project',
  projectSchema,
)
