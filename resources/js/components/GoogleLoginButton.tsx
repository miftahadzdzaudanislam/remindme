// resources/js/components/GoogleLoginButton.tsx
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from './ui/button';
import axios from 'axios';

export default function GoogleLoginButton({ setIsSignedIn }: { setIsSignedIn: (val: boolean) => void }) {
  const login = useGoogleLogin({
    onSuccess: async codeResponse => {
      console.log('Google login success response:', codeResponse);
      const { code } = codeResponse;
      const API_URL = import.meta.env.VITE_API_URL;

      if (!code) {
        alert('Code kosong dari Google, login gagal.');
        return;
      }

      try {
        // Dapatkan refresh_token dari Express
        const { data } = await axios.post(`${API_URL}/api/create-token`, { code });
        if (!data.refresh_token) {
          alert('refresh_token tidak ditemukan. Pastikan user login dengan consent screen.');
          return;
        }
        // Kirim refresh_token ke Laravel untuk disimpan di user
        await axios.post('/mahasiswa/store-google-token', {
          google_refresh_token: data.refresh_token,
        });
        setIsSignedIn(true);
        localStorage.setItem('google_signed_in', '1');
        alert('Login Google berhasil!');
      } catch (err: unknown) {
        console.error('Gagal login Google:', err.response?.data || err.message);
        alert('Gagal login Google Calendar');
      }
    },
    onError: () => {
      alert('Login Google gagal.');
    },
    flow: 'auth-code',
    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
  });

  return (
    <Button onClick={() => login()}>
      Login dengan Google
    </Button>
  );
}
