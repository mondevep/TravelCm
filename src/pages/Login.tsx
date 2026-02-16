import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Bus } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    telephone: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    telephone: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = { telephone: '', password: '' };
    let isValid = true;

    if (!formData.telephone) {
      newErrors.telephone = 'Telefonnummer ist erforderlich';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData);
      showToast('Erfolgreich angemeldet', 'success');
      navigate('/');
    } catch (error: any) {
      showToast(error.message || 'Anmeldung fehlgeschlagen', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Bus size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Willkommen zurück</h1>
          <p className="text-gray-600">Melden Sie sich an, um fortzufahren</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Telefonnummer"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              error={errors.telephone}
              placeholder="+237670000001"
            />

            <Input
              label="Passwort"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Anmelden
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Noch kein Konto?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
