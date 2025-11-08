import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Loader2, Eye, EyeOff, Facebook, Chrome, Twitter, Instagram, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

interface LocationState {
  mode?: 'signin' | 'signup';
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user } = useAuth();
  
  // Determine initial mode from location state or path
  const initialMode = (location.state as LocationState)?.mode || 
    (location.pathname === '/signup' ? 'signup' : 'signin');
  
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [containerClass, setContainerClass] = useState('');
  
  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Sign Up form state
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'USER' | 'SITE_OWNER'>('USER');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Validation state
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [focusedField, setFocusedField] = useState('');
  
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setContainerClass(mode === 'signin' ? 'sign-in' : 'sign-up');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Update mode when route changes
  useEffect(() => {
    const newMode = location.pathname === '/signup' ? 'signup' : 'signin';
    if (newMode !== mode) {
      setMode(newMode);
      setContainerClass(newMode === 'signin' ? 'sign-in' : 'sign-up');
      setError('');
      setSuccess('');
      setEmailError('');
      setPasswordStrength('');
    }
  }, [location.pathname]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'SITE_OWNER') {
        navigate('/site-owner-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 1) setPasswordStrength('weak');
    else if (strength <= 2) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  // Auto-dismiss success/error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Toggle between sign in and sign up
  const toggle = () => {
    setError('');
    setSuccess('');
    setEmailError('');
    setPasswordStrength('');
    if (mode === 'signin') {
      setMode('signup');
      setContainerClass('sign-up');
      navigate('/signup', { replace: true });
    } else {
      setMode('signin');
      setContainerClass('sign-in');
      navigate('/login', { replace: true });
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    setError('');
    setLoading(true);
    
    try {
      // In a production environment, you would redirect to OAuth providers
      // For now, we'll implement the OAuth flow structure
      
      const redirectUrls: Record<string, string> = {
        'Facebook': `https://www.facebook.com/v18.0/dialog/oauth?client_id=${import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID'}&redirect_uri=${window.location.origin}/auth/callback/facebook&state=${Math.random().toString(36)}`,
        'Google': `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}&redirect_uri=${window.location.origin}/auth/callback/google&response_type=code&scope=email%20profile`,
        'Twitter': `https://twitter.com/i/oauth2/authorize?client_id=${import.meta.env.VITE_TWITTER_CLIENT_ID || 'YOUR_TWITTER_CLIENT_ID'}&redirect_uri=${window.location.origin}/auth/callback/twitter&response_type=code&scope=tweet.read%20users.read`,
        'Instagram': `https://api.instagram.com/oauth/authorize?client_id=${import.meta.env.VITE_INSTAGRAM_APP_ID || 'YOUR_INSTAGRAM_APP_ID'}&redirect_uri=${window.location.origin}/auth/callback/instagram&scope=user_profile,user_media&response_type=code`
      };

      const url = redirectUrls[provider];
      
      if (url && !url.includes('YOUR_')) {
        // Redirect to OAuth provider
        window.location.href = url;
      } else {
        setError(`${provider} login is not configured yet. Please set up OAuth credentials in your environment variables.`);
        setLoading(false);
      }
    } catch (err) {
      setError(`Failed to initiate ${provider} login`);
      setLoading(false);
    }
  };

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signInEmail || !signInPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(signInEmail)) {
      return;
    }

    if (signInPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
      setSuccess('Successfully signed in!');
      // Navigation handled by useEffect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signUpUsername || !signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(signUpEmail)) {
      return;
    }

    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await signUp(signUpEmail, signUpPassword, signUpUsername, signUpRole);
      setSuccess('Account created successfully!');
      // Navigation handled by useEffect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container ${containerClass}`}>
      {/* FORM SECTION */}
      <div className="auth-row">
        {/* SIGN UP */}
        <div className="auth-col auth-align-items-center auth-flex-col sign-up">
          <div className="auth-form-wrapper auth-align-items-center">
            <form className="auth-form sign-up" onSubmit={handleSignUp} noValidate>
              {error && mode === 'signup' && (
                <div className="auth-error">
                  <AlertCircle size={16} className="inline mr-1" />
                  {error}
                </div>
              )}
              
              {success && mode === 'signup' && (
                <div className="auth-success">
                  <Check size={16} className="inline mr-1" />
                  {success}
                </div>
              )}
              
              <div className={`auth-input-group ${focusedField === 'signUpUsername' ? 'focused' : ''}`}>
                <User />
                <input
                  type="text"
                  placeholder="Username"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  onFocus={() => setFocusedField('signUpUsername')}
                  onBlur={() => setFocusedField('')}
                  disabled={loading}
                  required
                  aria-label="Username"
                />
              </div>
              
              <div className={`auth-input-group ${focusedField === 'signUpEmail' ? 'focused' : ''}`}>
                <Mail />
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={(e) => {
                    setSignUpEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onFocus={() => setFocusedField('signUpEmail')}
                  onBlur={() => {
                    setFocusedField('');
                    validateEmail(signUpEmail);
                  }}
                  disabled={loading}
                  required
                  aria-label="Email"
                  aria-invalid={!!emailError}
                />
                {emailError && mode === 'signup' && (
                  <span className="auth-input-error">{emailError}</span>
                )}
              </div>
              
              <div className={`auth-input-group ${focusedField === 'signUpRole' ? 'focused' : ''}`}>
                <User />
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value as 'USER' | 'SITE_OWNER')}
                  onFocus={() => setFocusedField('signUpRole')}
                  onBlur={() => setFocusedField('')}
                  disabled={loading}
                  required
                  aria-label="Account Type"
                  className="role-select"
                >
                  <option value="USER">Regular User</option>
                  <option value="SITE_OWNER">Site Owner</option>
                </select>
              </div>
              
              <div className={`auth-input-group ${focusedField === 'signUpPassword' ? 'focused' : ''}`}>
                <Lock />
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => {
                    setSignUpPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  onFocus={() => setFocusedField('signUpPassword')}
                  onBlur={() => setFocusedField('')}
                  disabled={loading}
                  required
                  minLength={6}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="password-toggle"
                  aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignUpPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {passwordStrength && signUpPassword && (
                <div className="auth-password-strength">
                  <div className="strength-bars">
                    <div className={`strength-bar ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? 'active weak' : ''}`}></div>
                    <div className={`strength-bar ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'active medium' : ''}`}></div>
                    <div className={`strength-bar ${passwordStrength === 'strong' ? 'active strong' : ''}`}></div>
                  </div>
                  <span className={`strength-text ${passwordStrength}`}>
                    {passwordStrength === 'weak' && 'Weak password'}
                    {passwordStrength === 'medium' && 'Medium strength'}
                    {passwordStrength === 'strong' && 'Strong password'}
                  </span>
                </div>
              )}
              
              <div className={`auth-input-group ${focusedField === 'signUpConfirm' ? 'focused' : ''}`}>
                <Lock />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('signUpConfirm')}
                  onBlur={() => setFocusedField('')}
                  disabled={loading}
                  required
                  minLength={6}
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {signUpConfirmPassword && signUpPassword !== signUpConfirmPassword && (
                  <span className="auth-input-error">Passwords don't match</span>
                )}
              </div>
              
              <div className="auth-checkbox">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="acceptTerms">
                  I accept the <span className="auth-pointer" onClick={() => navigate('/terms')}>Terms & Conditions</span>
                </label>
              </div>
              
              <button type="submit" disabled={loading || !acceptTerms}>
                {loading ? (
                  <>
                    <Loader2 className="inline mr-2 animate-spin" size={20} />
                    Creating account...
                  </>
                ) : (
                  'Sign up'
                )}
              </button>
              
              <div className="auth-divider">
                <span>or continue with</span>
              </div>
              
              <div className="auth-social-list">
                <button
                  type="button"
                  className="auth-social-button facebook-bg"
                  onClick={() => handleSocialLogin('Facebook')}
                  disabled={loading}
                  aria-label="Sign up with Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button
                  type="button"
                  className="auth-social-button google-bg"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading}
                  aria-label="Sign up with Google"
                >
                  <Chrome size={20} />
                </button>
                <button
                  type="button"
                  className="auth-social-button twitter-bg"
                  onClick={() => handleSocialLogin('Twitter')}
                  disabled={loading}
                  aria-label="Sign up with Twitter"
                >
                  <Twitter size={20} />
                </button>
                <button
                  type="button"
                  className="auth-social-button insta-bg"
                  onClick={() => handleSocialLogin('Instagram')}
                  disabled={loading}
                  aria-label="Sign up with Instagram"
                >
                  <Instagram size={20} />
                </button>
              </div>
              
              <p>
                <span>Already have an account? </span>
                <b onClick={toggle} className="auth-pointer">
                  Sign in here
                </b>
              </p>
            </form>
          </div>
        </div>
        {/* END SIGN UP */}

        {/* SIGN IN */}
        <div className="auth-col auth-align-items-center auth-flex-col sign-in">
          <div className="auth-form-wrapper auth-align-items-center">
            <form className="auth-form sign-in" onSubmit={handleSignIn} noValidate>
              {error && mode === 'signin' && (
                <div className="auth-error">
                  <AlertCircle size={16} className="inline mr-1" />
                  {error}
                </div>
              )}
              
              {success && mode === 'signin' && (
                <div className="auth-success">
                  <Check size={16} className="inline mr-1" />
                  {success}
                </div>
              )}
              
              <div className={`auth-input-group ${focusedField === 'signInEmail' ? 'focused' : ''}`}>
                <Mail />
                <input
                  type="email"
                  placeholder="Email"
                  value={signInEmail}
                  onChange={(e) => {
                    setSignInEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onFocus={() => setFocusedField('signInEmail')}
                  onBlur={() => {
                    setFocusedField('');
                    validateEmail(signInEmail);
                  }}
                  disabled={loading}
                  required
                  aria-label="Email"
                  aria-invalid={!!emailError}
                />
                {emailError && mode === 'signin' && (
                  <span className="auth-input-error">{emailError}</span>
                )}
              </div>
              
              <div className={`auth-input-group ${focusedField === 'signInPassword' ? 'focused' : ''}`}>
                <Lock />
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  onFocus={() => setFocusedField('signInPassword')}
                  onBlur={() => setFocusedField('')}
                  disabled={loading}
                  required
                  minLength={6}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="password-toggle"
                  aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="auth-options">
                <div className="auth-checkbox">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                
                <b 
                  onClick={() => navigate('/forgot-password')}
                  className="auth-pointer"
                >
                  Forgot password?
                </b>
              </div>
              
              <button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="inline mr-2 animate-spin" size={20} />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
              
              <div className="auth-divider">
                <span>or continue with</span>
              </div>
              
              <div className="auth-social-list">
                <button
                  type="button"
                  className="auth-social-button facebook-bg"
                  onClick={() => handleSocialLogin('Facebook')}
                  disabled={loading}
                  aria-label="Sign in with Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button
                  type="button"
                  className="auth-social-button google-bg"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading}
                  aria-label="Sign in with Google"
                >
                  <Chrome size={20} />
                </button>
                <button
                  type="button"
                  className="auth-social-button twitter-bg"
                  onClick={() => handleSocialLogin('Twitter')}
                  disabled={loading}
                  aria-label="Sign in with Twitter"
                >
                  <Twitter size={20} />
                </button>
                <button
                  type="button"
                  className="auth-social-button insta-bg"
                  onClick={() => handleSocialLogin('Instagram')}
                  disabled={loading}
                  aria-label="Sign in with Instagram"
                >
                  <Instagram size={20} />
                </button>
              </div>
              
              <p>
                <span>Don't have an account? </span>
                <b onClick={toggle} className="auth-pointer">
                  Sign up here
                </b>
              </p>
            </form>
          </div>
        </div>
        {/* END SIGN IN */}
      </div>
      {/* END FORM SECTION */}

      {/* CONTENT SECTION */}
      <div className="auth-row auth-content-row">
        {/* SIGN IN CONTENT */}
        <div className="auth-col auth-align-items-center auth-flex-col">
          <div className="auth-text sign-in">
            <h2>Welcome</h2>
          </div>
        </div>
        {/* END SIGN IN CONTENT */}

        {/* SIGN UP CONTENT */}
        <div className="auth-col auth-align-items-center auth-flex-col">
          <div className="auth-text sign-up">
            <h2>Join with us</h2>
          </div>
        </div>
        {/* END SIGN UP CONTENT */}
      </div>
      {/* END CONTENT SECTION */}
    </div>
  );
}
