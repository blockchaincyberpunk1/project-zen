import { render, screen } from '@testing-library/react';
import { useDocument } from '../../hooks/useDocument';
import Project from './Project';

// Mock the useParams hook to return a specific project ID
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
}));

// Mock the useDocument hook to return a project document
jest.mock('../../hooks/useDocument', () => ({
  useDocument: jest.fn(() => ({
    document: {
      id: '123',
      title: 'Test Project',
      description: 'This is a test project',
      createdBy: 'abc123',
    },
    error: null,
  })),
}));

describe('Project component', () => {
  it('should render the project summary and comments', () => {
    // Render the component
    render(<Project />);

    // Check that the useDocument hook was called with the correct collection and document ID
    expect(useDocument).toHaveBeenCalledWith('projects', '123');

    // Check that the project summary and comments are rendered with the correct project document as a prop
    const projectSummary = screen.getByTestId('project-summary');
    expect(projectSummary).toBeInTheDocument();
    expect(projectSummary).toHaveAttribute('project', '123');

    const projectComments = screen.getByTestId('project-comments');
    expect(projectComments).toBeInTheDocument();
    expect(projectComments).toHaveAttribute('project', '123');
  });

  it('should render an error message if there is an error retrieving the project document', () => {
    // Mock the useDocument hook to return an error
    useDocument.mockReturnValueOnce({ document: null, error: 'Error message' });

    // Render the component
    render(<Project />);

    // Check that the error message is rendered
    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should render a loading message if the project document is not yet available', () => {
    // Mock the useDocument hook to return null for the document
    useDocument.mockReturnValueOnce({ document: null, error: null });

    // Render the component
    render(<Project />);

    // Check that the loading message is rendered
    const loadingMessage = screen.getByText('Loading...');
    expect(loadingMessage).toBeInTheDocument();
  });
});
