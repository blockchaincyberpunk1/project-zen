import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import './Login.css';

export default function Login() {
  // Get form functions and validation rules from useForm hook
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Get login functions and state from useLogin hook
  const history = useHistory();
  const { login, error, isPending } = useLogin(history);
  
  // Define function to be called when form is submitted
  const onSubmit = (data) => {
    // Call login function with email and password from form data
    login(data.email, data.password);
  };

  return (
    // Use handleSubmit function as onSubmit prop for form element
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>login</h2>
      <label>
        <span>email:</span>
        {/* Use register function to register email input with form and set up validation rules */}
        <input
          {...register('email', { required: true })}
          type="email"
        />
      </label>
      <label>
        <span>password:</span>
        {/* Use register function to register password input with form and set up validation rules */}
        <input
          {...register('password', { required: true })}
          type="password"
        />
      </label>
      {/* Show login button unless isPending is true */}
      {!isPending && <button className="btn">Log in</button>}
      {/* Show loading button if isPending is true */}
      {isPending && <button className="btn" disabled>loading</button>}
      {/* Show error message if email field is not filled out */}
      {errors.email && <div className="error">Email is required</div>}
      {/* Show error message if password field is not filled out */}
      {errors.password && <div className="error">Password is required</div>}
      {/* Show error message if there is a login error */}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
