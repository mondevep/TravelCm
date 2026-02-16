import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { User, Phone, Mail, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nicht verfügbar';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: 'Administrator',
      AGENCE: 'Agentur',
      PASSAGER: 'Passagier',
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mein Profil</h1>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user.nom.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.nom}</h2>
              <p className="text-gray-600">{getRoleLabel(user.role)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <User size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-lg font-semibold text-gray-900">{user.nom}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Phone size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Telefonnummer</p>
                <p className="text-lg font-semibold text-gray-900">{user.telephone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Mail size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">E-Mail</p>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Shield size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Rolle</p>
                <p className="text-lg font-semibold text-gray-900">{getRoleLabel(user.role)}</p>
              </div>
            </div>

            {user.dateCreation && (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <Calendar size={24} className="text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Mitglied seit</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(user.dateCreation)}
                  </p>
                </div>
              </div>
            )}

            {user.agenceId && (
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex-1">
                  <p className="text-sm text-blue-600 mb-1">Agentur ID</p>
                  <p className="text-lg font-semibold text-blue-900">{user.agenceId}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Kontoinformationen</h3>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Konto aktiv
            </p>
            <p className="text-sm">
              Ihre Daten werden sicher gespeichert und nur für Buchungszwecke verwendet.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
