import { renderHook } from '@testing-library/react-hooks';
import { useFirestore } from './useFirestore';

describe('useFirestore', () => {
  const collection = 'projects';
  
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFirestore(collection));
    expect(result.current.response).toEqual({
      document: null,
      isPending: false,
      error: null,
      success: null,
    });
  });

  it('should add a document to Firestore', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFirestore(collection));

    // Add a new document
    const newDocument = { name: 'Test Project', details: 'This is a test project.' };
    result.current.addDocument(newDocument);
    expect(result.current.response.isPending).toBe(true);

    // Wait for the response state to update
    await waitForNextUpdate();
    expect(result.current.response.isPending).toBe(false);
    expect(result.current.response.error).toBe(null);
    expect(result.current.response.success).toBe(true);
    expect(result.current.response.document).toBeDefined();
  });

  it('should delete a document from Firestore', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFirestore(collection));

    // Add a new document to delete later
    const newDocument = { name: 'Test Project', details: 'This is a test project.' };
    await result.current.addDocument(newDocument);

    // Delete the added document
    const { document } = result.current.response;
    result.current.deleteDocument(document.id);
    expect(result.current.response.isPending).toBe(true);

    // Wait for the response state to update
    await waitForNextUpdate();
    expect(result.current.response.isPending).toBe(false);
    expect(result.current.response.error).toBe(null);
    expect(result.current.response.success).toBe(true);
    expect(result.current.response.document).toBe(null);
  });

  it('should update a document in Firestore', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFirestore(collection));

    // Add a new document to update later
    const newDocument = { name: 'Test Project', details: 'This is a test project.' };
    await result.current.addDocument(newDocument);

    // Update the added document
    const { document } = result.current.response;
    result.current.updateDocument(document.id, { details: 'Updated details.' });
    expect(result.current.response.isPending).toBe(true);

    // Wait for the response state to update
    await waitForNextUpdate();
    expect(result.current.response.isPending).toBe(false);
    expect(result.current.response.error).toBe(null);
    expect(result.current.response.success).toBe(true);
    expect(result.current.response.document).toBeDefined();
    expect(result.current.response.document.details).toBe('Updated details.');
  });
});
