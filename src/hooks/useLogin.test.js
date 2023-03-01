import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthContext } from './useAuthContext';
import { projectAuth, projectFirestore } from '../firebase/config';
import { useLogin } from './useLogin';

// Mock the useAuthContext hook
jest.mock('./useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

describe('useLogin', () => {
  // Set up the useAuthContext mock before each test
  beforeEach(() => {
    useAuthContext.mockReturnValue({
      dispatch: jest.fn(),
    });
  });

  it('should log in a user successfully', async () => {
    // Define test data
    const email = 'test@example.com';
    const password = 'testpassword';
    const user = { uid: '123', email };
    const signInSpy = jest.fn(() => ({ user }));
    const updateSpy = jest.fn();

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useLogin());

    // Spy on signInWithEmailAndPassword and collection().doc().update methods
    jest.spyOn(projectAuth, 'signInWithEmailAndPassword').mockImplementation(signInSpy);
    jest.spyOn(projectFirestore.collection('users').doc(user.uid), 'update').mockImplementation(updateSpy);

    // Call the login function with the test data
    act(() => {
      result.current.login(email, password);
    });

    // Wait for the hook to update
    await waitForNextUpdate();

    // Assertions
    expect(signInSpy).toHaveBeenCalledTimes(1);
    expect(signInSpy).toHaveBeenCalledWith(email, password);
    expect(projectFirestore.collection('users').doc(user.uid).update).toHaveBeenCalledTimes(1);
    expect(projectFirestore.collection('users').doc(user.uid).update).toHaveBeenCalledWith({ online: true });
    expect(useAuthContext().dispatch).toHaveBeenCalledTimes(1);
    expect(useAuthContext().dispatch).toHaveBeenCalledWith({ type: 'LOGIN', payload: user });
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
  });

  it('should handle login error', async () => {
    // Define test data
    const email = 'test@example.com';
    const password = 'testpassword';
    const error = new Error('test error');

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useLogin());

    // Spy on signInWithEmailAndPassword method and return an error
    jest.spyOn(projectAuth, 'signInWithEmailAndPassword').mockRejectedValueOnce(error);

    // Call the login function with the test data
    act(() => {
      result.current.login(email, password);
    });

    // Wait for the hook to update
    await waitForNextUpdate();

    // Assertions
    expect(projectAuth.signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(projectAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    expect(useAuthContext().dispatch).not.toHaveBeenCalled();
    expect(result.current.error).toEqual(error.message);
    expect(result.current.isPending).toBe(false);
  });
});
