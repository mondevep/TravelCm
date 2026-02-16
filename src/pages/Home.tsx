import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    depart: '',
    destination: '',
    date: '',
    minPlaces: 1,
  });

  const popularRoutes = [
    { from: 'Douala', to: 'Yaoundé', price: '5000 FCFA' },
    { from: 'Yaoundé', to: 'Bafoussam', price: '3500 FCFA' },
    { from: 'Douala', to: 'Bamenda', price: '4500 FCFA' },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams({
      depart: searchData.depart,
      destination: searchData.destination,
      date: searchData.date,
      minPlaces: searchData.minPlaces.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <Layout>
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Ihre Reise beginnt hier
            </h1>
            <p className="text-xl text-blue-100">
              Buchen Sie günstige Bustickets in ganz Kamerun
            </p>
          </div>

          <Card className="max-w-4xl mx-auto p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Von (z.B. Douala)"
                  value={searchData.depart}
                  onChange={(e) => setSearchData({ ...searchData, depart: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Nach (z.B. Yaoundé)"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900"
                />
              </div>

              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="1"
                  value={searchData.minPlaces}
                  onChange={(e) => setSearchData({ ...searchData, minPlaces: parseInt(e.target.value) || 1 })}
                  placeholder="Anzahl Plätze"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSearch}
            >
              <Search size={20} className="mr-2" />
              Fahrten suchen
            </Button>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Beliebte Strecken</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularRoutes.map((route, index) => (
            <Card
              key={index}
              hover
              className="p-6"
              onClick={() => {
                setSearchData({
                  ...searchData,
                  depart: route.from,
                  destination: route.to,
                });
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{route.from}</p>
                  <p className="text-sm text-gray-500">nach</p>
                  <p className="text-lg font-semibold text-gray-900">{route.to}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">ab</p>
                  <p className="text-xl font-bold text-blue-600">{route.price}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Einfach suchen</h3>
              <p className="text-gray-600">
                Finden Sie schnell und einfach Ihre gewünschte Verbindung
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexibel buchen</h3>
              <p className="text-gray-600">
                Wählen Sie aus verschiedenen Zeiten und Agenturen
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sicher reisen</h3>
              <p className="text-gray-600">
                Vertrauen Sie auf geprüfte Agenturen und sichere Buchungen
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
