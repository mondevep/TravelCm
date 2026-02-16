import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { UserRole } from '../types/api.types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Bus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    nom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {
      nom: '',
      telephone: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!formData.nom) {
      newErrors.nom = 'Name ist erforderlich';
      isValid = false;
    }

    if (!formData.telephone) {
      newErrors.telephone = 'Telefonnummer ist erforderlich';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'E-Mail ist erforderlich';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Passwort muss mindestens 6 Zeichen lang sein';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
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
      await register({
        nom: formData.nom,
        telephone: formData.telephone,
        email: formData.email,
        password: formData.password,
        role: UserRole.PASSAGER,
      });
      showToast('Erfolgreich registriert', 'success');
      navigate('/');
    } catch (error: any) {
      showToast(error.message || 'Registrierung fehlgeschlagen', 'error');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Konto erstellen</h1>
          <p className="text-gray-600">Registrieren Sie sich für Ihre erste Fahrt</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Name"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              error={errors.nom}
            />

            <Input
              label="Telefonnummer"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              error={errors.telephone}
              placeholder="+237670000001"
            />

            <Input
              label="E-Mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <Input
              label="Passwort"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <Input
              label="Passwort bestätigen"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Registrieren
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Bereits ein Konto?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
