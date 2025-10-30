import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type Provider = 'facebook' | 'google' | 'twitter' | 'instagram';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  // Extract provider from URL path
  const provider = window.location.pathname.split('/').pop() as Provider;

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the authorization code from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || `${provider} authentication failed`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        setMessage(`Authenticating with ${provider}...`);

        // Send the code to your backend to exchange for access token
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/oauth/${provider}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Authentication failed');
        }

        const data = await response.json();

        // Sign in with the received token
        if (data.token && data.user) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Store token and user data
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate('/', { replace: true });
            window.location.reload(); // Refresh to update auth state
          }, 1500);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Authentication failed');
        
        // Redirect to login page after showing error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, provider, navigate, signIn]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E2EAD6' }}>
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" style={{ color: '#059669' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>
              Authenticating...
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#059669' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>
              Success!
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#059669' }}
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
