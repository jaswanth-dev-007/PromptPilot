import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface IUser {
  email: string
  passwordHash: string
  name: string
  avatarUrl?: string
  role: 'admin' | 'member'
  isActive: boolean
  lastLoginAt?: Date
  refreshTokenHash?: string
  createdAt: Date
  updatedAt: Date
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: undefined,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: undefined,
    },
    refreshTokenHash: {
      type: String,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>
        delete obj.passwordHash
        delete obj.refreshTokenHash
        delete obj.__v
        return obj
      },
    },
  },
)

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema)
