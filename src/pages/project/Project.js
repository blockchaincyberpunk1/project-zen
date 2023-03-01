import { useParams } from "react-router-dom"
import { useDocument } from '../../hooks/useDocument'

// Import the components
import ProjectComments from "./ProjectComments"
import ProjectSummary from "./ProjectSummary"

// Import the styles
import './Project.css'

export default function Project() {
  // Get the project ID from the URL parameters
  const { id } = useParams()
  // Use the useDocument hook to get the project document
  const { document, error } = useDocument('projects', id)

  // Render the appropriate content depending on the error and loading status
  if (error) {
    return <div className="error">{error}</div>
  }
  if (!document) {
    return <div className="loading">Loading...</div>
  }

  // Render the ProjectSummary and ProjectComments components with the project document as a prop
  return (
    <div className="project-details">
      <ProjectSummary project={document} />
      <ProjectComments project={document} />
    </div>
  )
}
