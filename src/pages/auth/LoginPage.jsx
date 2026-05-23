import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi2';
import { toast } from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import authService from '../../services/authService';
import { isValidEmail } from '../../utils/helpers';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginStart());
    try {
      const user = await authService.login(formData.email, formData.password);
      dispatch(loginSuccess(user));
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          icon={HiOutlineEnvelope}
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            name="password"
            type="password"
            icon={HiOutlineLockClosed}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
          />
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={loading}
          icon={HiOutlineArrowRight}
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          Create account
        </Link>
      </div>

      {/* Demo Credentials Alert */}
      <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 rounded-xl">
        <p className="text-xs text-primary-800 dark:text-primary-300 font-medium mb-2">
          Demo Credentials:
        </p>
        <ul className="text-xs text-primary-600 dark:text-primary-400 space-y-1 list-disc list-inside">
          <li>john@example.com</li>
          <li>sarah@example.com</li>
        </ul>
        <p className="text-[10px] text-primary-500/70 dark:text-primary-400/50 mt-2 italic">
          *Any password will work for the demo
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
