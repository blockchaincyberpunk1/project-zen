import { useState } from "react"
import { timestamp } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore"
import Avatar from "../../components/Avatar"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function ProjectComments({ project }) {
  // Get the user from the auth context
  const { user } = useAuthContext()
  // Get the updateDocument function and response object from useFirestore
  const { updateDocument, response } = useFirestore('projects')
  // State to store the new comment
  const [newComment, setNewComment] = useState('')

  // Handle submission of the comment form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new comment object with current user details
    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random()
    }
    
    // Update the comments field of the project with the new comment
    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    })
    // If there was no error in updating, clear the newComment state
    if (!response.error) {
      setNewComment('')
    }
  }

  return (
    <div className="project-comments">
      <h4>Project Comments</h4>

      <ul>
        {project.comments.length > 0 && project.comments.map(comment => (
          <li key={comment.id}>
            <div className="comment-author">
              <Avatar src={comment.photoURL} />
              <p>{comment.displayName}</p>
            </div>
            <div className="comment-date">
              <p>{formatDistanceToNow(comment.createdAt.toDate(), {addSuffix: true})}</p>
            </div>
            <div className="comment-content">
              <p>{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>

      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea 
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          ></textarea>
        </label>
        <button className="btn">Add Comment</button>
      </form>
    </div>
  )
}