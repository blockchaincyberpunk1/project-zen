import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { useLogin } from '../../hooks/useLogin';

jest.mock('../../hooks/useLogin');

describe('Login', () => {
  it('should render', () => {
    const { getByText } = render(<Login />);
    expect(getByText('login')).toBeInTheDocument();
  });

  it('should call login function when form is submitted', async () => {
    // Mock login function
    const login = jest.fn();
    // Mock useLogin hook
    useLogin.mockReturnValue({ login });
    // Render Login component
    const { getByText, getByLabelText } = render(<Login />);
    // Get email and password inputs
    const emailInput = getByLabelText('email:');
    const passwordInput = getByLabelText('password:');
    // Fill out email and password inputs
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    // Get login button
    const loginButton = getByText('Log in');
    // Click login button
    fireEvent.click(loginButton);
    // Wait for login function to be called
    await waitFor(() => expect(login).toHaveBeenCalled());
    // Check that login function was called with correct arguments
    expect(login).toHaveBeenCalledWith('test@test.com', 'password');
  });

  it('should show error message if email is not filled out', async () => {
    // Render Login component
    const { getByText, getByLabelText } = render(<Login />);
    // Get email and password inputs
    const emailInput = getByLabelText('email:');
    const passwordInput = getByLabelText('password:');
    // Fill out password input
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    // Get login button
    const loginButton = getByText('Log in');
    // Click login button
    fireEvent.click(loginButton);
    // Wait for error message to be shown
    await waitFor(() => expect(getByText('Email is required')).toBeInTheDocument());
    // Fill out email input
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    // Click login button
    fireEvent.click(loginButton);
    // Wait for error message to be removed
    await waitFor(() => expect(() => getByText('Email is required')).toThrow());
  });

  it('should show error message if password is not filled out', async () => {
    // Render Login component
    const { getByText, getByLabelText } = render(<Login />);
    // Get email and password inputs
    const emailInput = getByLabelText('email:');
    const passwordInput = getByLabelText('password:');
    // Fill out email input
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    // Get login button
    const loginButton = getByText('Log in');
    // Click login button
    fireEvent.click(loginButton);
    // Wait for error message to be shown
    await waitFor(() => expect(getByText('Password is required')).toBeInTheDocument());
    // Fill out password input
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    // Click login button
    fireEvent.click(loginButton);
    // Wait for error message to be removed
    await waitFor(() => expect(() => getByText('Password is required')).toThrow());
  });

  it('should show loading button when login is pending', async () => {
    // Mock useLogin hook
    useLogin.mockReturnValue({ isPending: true });
    // Render Login component
    const { getByText } = render(<Login />);
    // Get loading button
    const loadingButton = getByText('loading');
    // Check that loading button is shown
    expect(loadingButton).toBeInTheDocument();
  });

  it('should show error message if login fails', async () => {
    // Mock useLogin hook
    useLogin.mockReturnValue({ error: 'Login failed' });
    // Render Login component
    const { getByText } = render(<Login />);
    // Check that error message is shown
    expect(getByText('Login failed')).toBeInTheDocument();
  });
});