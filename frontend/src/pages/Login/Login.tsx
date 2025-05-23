import { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import ToastAlert from '../../components/ToastAlert';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

function getFirebaseErrorMessage(code: string) {
  switch (code) {
    case 'auth/invalid-email':
      return 'O email digitado não é válido.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique o email.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/email-already-in-use':
      return 'Este email já está em uso.';
    case 'auth/weak-password':
      return 'Senha muito fraca. Use pelo menos 6 caracteres.';
    default:
      return 'Ocorreu um erro. Tente novamente mais tarde.';
  }
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const login = async () => {
    if (!email || !password) {
      showToast('Preencha email e senha para continuar.', 'info');
      return;
    }
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      showToast('Login efetuado com sucesso!', 'success');
      onLoginSuccess(token);
    } catch (err: unknown) {
      const message = getFirebaseErrorMessage((err as { code: string }).code || '');
      showToast(`Erro no login: ${message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    if (!email || !password) {
      showToast('Preencha email e senha para continuar.', 'info');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast('Registro efetuado com sucesso! Agora faça login.', 'success');
      setIsRegistering(false);
    } catch (err: unknown) {
      const message = getFirebaseErrorMessage((err as { code: string }).code || '');
      showToast(`Erro no registro: ${message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left - Image */}
        <div
          className="hidden md:flex w-1/2 bg-green-100"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="w-full h-full bg-green-900/30"></div>
        </div>

        {/* Right - Form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-10 bg-green-50">
          <div className="max-w-sm w-full p-8 rounded-2xl shadow-xl bg-white">
            <h2 className="text-3xl font-semibold mb-6 text-green-800 text-center">
              {isRegistering ? 'Registre-se' : 'Faça Login'}
            </h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-green-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-200
                         placeholder-gray-500 text-gray-700"
              disabled={loading}
            />
            <div className="relative w-full mb-6">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-green-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-green-200
                           placeholder-gray-500 text-gray-700 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 hover:text-green-900 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477-1 12-1s10 4.477 10 10c0 1.05-.162 2.058-.45 3.005M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              onClick={isRegistering ? register : login}
              className="w-full bg-green-600 text-white font-semibold rounded-lg
                         py-3 mb-4 hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Carregando...' : isRegistering ? 'Registrar' : 'Entrar'}
            </button>

            <p className="text-center text-sm text-gray-600">
              {isRegistering ? (
                <>
                  Já tem uma conta?{' '}
                  <button
                    className="text-green-700 hover:underline font-semibold"
                    onClick={() => setIsRegistering(false)}
                    disabled={loading}
                  >
                    Faça login aqui
                  </button>
                </>
              ) : (
                <>
                  Não tem registro?{' '}
                  <button
                    className="text-green-700 hover:underline font-semibold"
                    onClick={() => setIsRegistering(true)}
                    disabled={loading}
                  >
                    Registre-se aqui
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <ToastAlert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3500}
        />
      )}
    </>
  );
}
