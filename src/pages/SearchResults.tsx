import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import apiService from '../services/api.service';
import { Horaire } from '../types/api.types';
import { Clock, MapPin, Users, Bus as BusIcon } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'time' | 'price'>('time');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const fetchHoraires = async () => {
      const depart = searchParams.get('depart');
      const destination = searchParams.get('destination');
      const date = searchParams.get('date');
      const minPlaces = searchParams.get('minPlaces');

      if (!depart || !destination || !date) {
        showToast('Bitte füllen Sie alle Suchfelder aus', 'error');
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        const results = await apiService.searchHoraires({
          depart,
          destination,
          date: new Date(date).toISOString(),
          minPlaces: minPlaces ? parseInt(minPlaces) : 1,
        });
        setHoraires(results);
        if (results.length === 0) {
          showToast('Keine Fahrten gefunden', 'info');
        }
      } catch (error: any) {
        showToast(error.message || 'Fehler beim Laden der Fahrten', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoraires();
  }, [searchParams, navigate, showToast]);

  const filteredAndSortedHoraires = () => {
    let filtered = [...horaires];

    if (priceFilter !== 'all') {
      const maxPrice = Math.max(...horaires.map(h => h.prixIndividuel));
      const minPrice = Math.min(...horaires.map(h => h.prixIndividuel));
      const range = maxPrice - minPrice;

      filtered = filtered.filter(h => {
        if (priceFilter === 'low') return h.prixIndividuel <= minPrice + range * 0.33;
        if (priceFilter === 'medium') return h.prixIndividuel > minPrice + range * 0.33 && h.prixIndividuel <= minPrice + range * 0.66;
        if (priceFilter === 'high') return h.prixIndividuel > minPrice + range * 0.66;
        return true;
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return a.prixIndividuel - b.prixIndividuel;
      }
      return new Date(a.dateDepart).getTime() - new Date(b.dateDepart).getTime();
    });

    return filtered;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBooking = (horaire: Horaire) => {
    navigate(`/booking/${horaire.id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchParams.get('depart')} → {searchParams.get('destination')}
          </h1>
          <p className="text-gray-600">
            {filteredAndSortedHoraires().length} Fahrten gefunden
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('time')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                sortBy === 'time'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Nach Zeit
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                sortBy === 'price'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Nach Preis
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                priceFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Alle Preise
            </button>
            <button
              onClick={() => setPriceFilter('low')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                priceFilter === 'low'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Günstig
            </button>
            <button
              onClick={() => setPriceFilter('medium')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                priceFilter === 'medium'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Mittel
            </button>
            <button
              onClick={() => setPriceFilter('high')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                priceFilter === 'high'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Premium
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedHoraires().map((horaire) => (
            <Card key={horaire.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Von</p>
                        <p className="font-semibold text-gray-900">{horaire.trajet.depart}</p>
                      </div>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-4"></div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Nach</p>
                        <p className="font-semibold text-gray-900">{horaire.trajet.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{formatDate(horaire.dateDepart)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{horaire.placesDisponibles} Plätze frei</span>
                    </div>
                    {horaire.buses.length > 0 && (
                      <div className="flex items-center gap-2">
                        <BusIcon size={16} />
                        <span>{horaire.buses[0].modele}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Preis pro Person</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {horaire.prixIndividuel.toLocaleString()} FCFA
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleBooking(horaire)}
                    disabled={horaire.placesDisponibles === 0}
                  >
                    Jetzt buchen
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAndSortedHoraires().length === 0 && !isLoading && (
          <Card className="p-12 text-center">
            <BusIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Keine Fahrten gefunden
            </h3>
            <p className="text-gray-600 mb-6">
              Versuchen Sie es mit anderen Suchkriterien oder einem anderen Datum
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Neue Suche starten
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
