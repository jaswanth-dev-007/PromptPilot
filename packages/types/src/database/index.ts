export interface Entity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface User extends Entity {
  email: string
  name: string
  role: 'admin' | 'member'
}
