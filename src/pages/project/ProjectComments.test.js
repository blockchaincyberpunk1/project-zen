import { render, screen, fireEvent } from '@testing-library/react';
import { useFirestore } from '../../hooks/useFirestore';
import ProjectComments from './ProjectComments';

// Mock the useAuthContext hook to return a mock user
jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(() => ({
    user: {
      displayName: 'Test User',
      photoURL: 'https://example.com/avatar.jpg',
    },
  })),
}));

// Mock the useFirestore hook to return a response with no error
jest.mock('../../hooks/useFirestore', () => ({
  useFirestore: jest.fn(() => ({
    updateDocument: jest.fn(),
    response: { error: null },
  })),
}));

describe('ProjectComments component', () => {
  it('should render the comments for a project', () => {
    const project = {
      id: '123',
      title: 'Test Project',
      description: 'This is a test project',
      createdBy: 'abc123',
      comments: [
        {
          id: 1,
          displayName: 'Test User 1',
          photoURL: 'https://example.com/avatar1.jpg',
          content: 'Comment 1',
          createdAt: { toDate: () => new Date() },
        },
        {
          id: 2,
          displayName: 'Test User 2',
          photoURL: 'https://example.com/avatar2.jpg',
          content: 'Comment 2',
          createdAt: { toDate: () => new Date() },
        },
      ],
    };

    // Render the component with the mock project as a prop
    render(<ProjectComments project={project} />);

    // Check that the comments are rendered correctly
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Comment 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
    expect(screen.getByText('Comment 2')).toBeInTheDocument();
  });

  it('should add a new comment when the form is submitted', async () => {
    const project = {
      id: '123',
      title: 'Test Project',
      description: 'This is a test project',
      createdBy: 'abc123',
      comments: [],
    };

    // Render the component with the mock project as a prop
    render(<ProjectComments project={project} />);

    // Enter text into the comment textarea and submit the form
    const commentTextarea = screen.getByRole('textbox');
    fireEvent.change(commentTextarea, { target: { value: 'New comment' } });
    const submitButton = screen.getByRole('button', { name: 'Add Comment' });
    fireEvent.click(submitButton);

    // Check that the updateDocument function was called with the correct arguments
    expect(useFirestore().updateDocument).toHaveBeenCalledWith('123', {
      comments: [
        {
          displayName: 'Test User',
          photoURL: 'https://example.com/avatar.jpg',
          content: 'New comment',
          createdAt: expect.any(Object),
          id: expect.any(Number),
        },
      ],
    });

    // Check that the new comment is rendered in the list
    const commentList = screen.getByRole('list');
    expect(commentList).toHaveTextContent('New comment');
  });
});
