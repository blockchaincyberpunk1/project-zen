import { render, screen } from '@testing-library/react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import Dashboard from './Dashboard';

// Mock the useAuthContext and useCollection hooks
jest.mock('../../hooks/useAuthContext');
jest.mock('../../hooks/useCollection');

describe('Dashboard component', () => {
  it('should render the title', () => {
    // Mock the return value of useAuthContext
    useAuthContext.mockReturnValue({ user: { uid: '123' } });
    // Mock the return value of useCollection
    useCollection.mockReturnValue({ documents: [], error: null });

    // Render the Dashboard component
    render(<Dashboard />);

    // Expect the title element to be in the document
    const titleElement = screen.getByText(/dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the project list', () => {
    // Mock the return value of useAuthContext
    useAuthContext.mockReturnValue({ user: { uid: '123' } });
    // Mock the return value of useCollection
    useCollection.mockReturnValue({
      documents: [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' },
      ],
      error: null,
    });

    // Render the Dashboard component
    render(<Dashboard />);

    // Expect the project list element to be in the document
    const projectListElement = screen.getByRole('list');
    expect(projectListElement).toBeInTheDocument();
  });

  it('should render an error message if there is an error fetching projects', () => {
    // Mock the return value of useAuthContext
    useAuthContext.mockReturnValue({ user: { uid: '123' } });
    // Mock the return value of useCollection
    useCollection.mockReturnValue({ documents: null, error: 'Error message' });

    // Render the Dashboard component
    render(<Dashboard />);

    // Expect the error message element to be in the document
    const errorMessageElement = screen.getByText(/error message/i);
    expect(errorMessageElement).toBeInTheDocument();
  });

  it('should render a message if there are no projects for the current filter', () => {
    // Mock the return value of useAuthContext
    useAuthContext.mockReturnValue({ user: { uid: '123' } });
    // Mock the return value of useCollection
    useCollection.mockReturnValue({ documents: [], error: null });

    // Render the Dashboard component
    render(<Dashboard />);

    // Expect the "no projects found" message element to be in the document
    const noProjectsElement = screen.getByText(/no projects found/i);
    expect(noProjectsElement).toBeInTheDocument();
  });
});
