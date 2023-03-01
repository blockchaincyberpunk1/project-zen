import { useCollection } from '../../hooks/useCollection'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

// components
import ProjectList from '../../components/ProjectList'
import ProjectFilter from './ProjectFilter'

// styles
import './Dashboard.css'

export default function Dashboard() {
  // retrieve the authenticated user from context
  const { user } = useAuthContext()
  // retrieve the projects from the Firestore collection
  const { documents, error } = useCollection('projects')
  // set the initial filter to 'all'
  const [filter, setFilter] = useState('all')

  // Define a mapping of filter names to filter functions
  const filterMap = {
    all: () => true,
    mine: (document) => {
      // check if the current user is assigned to the project
      return document.assignedUsersList?.some(u => u.id === user.uid)
    },
    industrial: (document) => document.category === 'industrial',
    commerical: (document) => document.category === 'commerical',
    'multi-family': (document) => document.category === 'multi-family',
    residential: (document) => document.category === 'residential',
  }

  // handler for changing the filter
  const changeFilter = (newFilter) => {
    setFilter(newFilter)
  }

  // Calculate the filtered projects
  const projects = documents
    ?.filter(filterMap[filter] || filterMap.all)
    ?? []

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && <ProjectFilter changeFilter={changeFilter} />}
      {projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <p>No projects found for the current filter.</p>
      )}
    </div>
  )
}
