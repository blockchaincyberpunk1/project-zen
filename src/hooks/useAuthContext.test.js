// Import necessary modules
import { renderHook } from '@testing-library/react-hooks';
import { AuthContext } from '../context/AuthContext';
import { useAuthContext } from './useAuthContext';

// Describe the test suite for useAuthContext
describe('useAuthContext', () => {
  // Test that the hook returns the authentication context when used within an AuthContextProvider
  it('should return the authentication context', () => {
    // Define the value of the authentication context
    const value = { user: { name: 'John Doe' } };
    // Wrap the hook in an AuthContext.Provider with the defined value
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );

    // Render the hook with the defined wrapper
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    // Assert that the returned value of the hook matches the defined value
    expect(result.current).toEqual(value);
  });

  // Test that the hook throws an error when used outside of an AuthContextProvider
  it('should throw an error if used outside of an AuthContextProvider', () => {
    // Render the hook without a wrapper
    const { result } = renderHook(() => useAuthContext());

    // Assert that an error is thrown when the hook is used outside of an AuthContextProvider
    expect(result.error).toEqual(
      Error('useAuthContext must be used within an AuthContextProvider')
    );
  });
});
