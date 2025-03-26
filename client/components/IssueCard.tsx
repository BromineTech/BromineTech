type IssueCardProps = {
    issue: {
      id: number
      title: string
      milestone: number
      assignedTo: string
    }
  }
  
  export default function IssueCard({ issue }: IssueCardProps) {
    return (
      <div className="bg-gray-800 rounded-md p-3 grid grid-cols-3 gap-2">
        <div>{issue.title}</div>
        <div className="text-center">milestone {issue.milestone}</div>
        <div className="text-right">{issue.assignedTo}</div>
      </div>
    )
  }
  
  