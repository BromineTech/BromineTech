export type Status = "Active" | "Backlog" | "Done"

export type Member = {
  id: string
  name: string
  email: string
}

export type ProjectProperties = {
  status: Status
  members: Member[]
  startDate: Date | null
  targetDate: Date | null
}

