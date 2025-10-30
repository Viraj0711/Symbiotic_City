import axios from 'axios';

interface OAuthUser {
  email: string;
  name: string;
  avatar?: string;
  provider: string;
  providerId: string;
}

export class OAuthService {
  // Facebook OAuth
  static async getFacebookUser(code: string): Promise<OAuthUser> {
    try {
      // Exchange code for access token
      const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          code,
          redirect_uri: `${process.env.FRONTEND_URL}/auth/callback/facebook`,
        },
      });

      const accessToken = tokenResponse.data.access_token;

      // Get user profile
      const userResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
          fields: 'id,name,email,picture',
          access_token: accessToken,
        },
      });

      const { id, name, email, picture } = userResponse.data;

      return {
        email: email || `${id}@facebook.com`,
        name: name || 'Facebook User',
        avatar: picture?.data?.url,
        provider: 'facebook',
        providerId: id,
      };
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      throw new Error('Failed to authenticate with Facebook');
    }
  }

  // Google OAuth
  static async getGoogleUser(code: string): Promise<OAuthUser> {
    try {
      // Exchange code for access token
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.FRONTEND_URL}/auth/callback/google`,
        grant_type: 'authorization_code',
      });

      const accessToken = tokenResponse.data.access_token;

      // Get user profile
      const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id, name, email, picture } = userResponse.data;

      return {
        email: email || `${id}@google.com`,
        name: name || 'Google User',
        avatar: picture,
        provider: 'google',
        providerId: id,
      };
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  // Twitter OAuth
  static async getTwitterUser(code: string): Promise<OAuthUser> {
    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: process.env.TWITTER_CLIENT_ID!,
          redirect_uri: `${process.env.FRONTEND_URL}/auth/callback/twitter`,
          code_verifier: 'challenge', // You should implement PKCE properly
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
            ).toString('base64')}`,
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Get user profile
      const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
        params: {
          'user.fields': 'profile_image_url,name',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id, name, username, profile_image_url } = userResponse.data.data;

      return {
        email: `${username}@twitter.com`, // Twitter API v2 doesn't provide email easily
        name: name || username || 'Twitter User',
        avatar: profile_image_url,
        provider: 'twitter',
        providerId: id,
      };
    } catch (error) {
      console.error('Twitter OAuth error:', error);
      throw new Error('Failed to authenticate with Twitter');
    }
  }

  // Instagram OAuth
  static async getInstagramUser(code: string): Promise<OAuthUser> {
    try {
      // Exchange code for access token
      const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.FRONTEND_URL}/auth/callback/instagram`,
        code,
      });

      const { access_token, user_id } = tokenResponse.data;

      // Get user profile
      const userResponse = await axios.get(
        `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${access_token}`
      );

      const { id, username } = userResponse.data;

      return {
        email: `${username}@instagram.com`,
        name: username || 'Instagram User',
        provider: 'instagram',
        providerId: id || user_id,
      };
    } catch (error) {
      console.error('Instagram OAuth error:', error);
      throw new Error('Failed to authenticate with Instagram');
    }
  }
}
