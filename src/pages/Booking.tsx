import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import apiService from '../services/api.service';
import { Horaire } from '../types/api.types';
import { MapPin, Clock, Users, Bus as BusIcon, CheckCircle, Minus, Plus } from 'lucide-react';

const Booking = () => {
  const { horaireId } = useParams<{ horaireId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [horaire, setHoraire] = useState<Horaire | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anzahlPlaetze, setAnzahlPlaetze] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchHoraire = async () => {
      if (!horaireId) {
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        const results = await apiService.searchHoraires({
          depart: '',
          destination: '',
          date: new Date().toISOString(),
          minPlaces: 1,
        });
        const foundHoraire = results.find(h => h.id === parseInt(horaireId));
        if (foundHoraire) {
          setHoraire(foundHoraire);
        } else {
          showToast('Fahrt nicht gefunden', 'error');
          navigate('/');
        }
      } catch (error: any) {
        showToast(error.message || 'Fehler beim Laden der Fahrt', 'error');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoraire();
  }, [horaireId, navigate, showToast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleIncrement = () => {
    if (horaire && anzahlPlaetze < horaire.placesDisponibles) {
      setAnzahlPlaetze(anzahlPlaetze + 1);
    }
  };

  const handleDecrement = () => {
    if (anzahlPlaetze > 1) {
      setAnzahlPlaetze(anzahlPlaetze - 1);
    }
  };

  const handleBooking = async () => {
    if (!horaire) return;

    setIsBooking(true);
    try {
      await apiService.createReservation({
        details: [
          {
            horaireId: horaire.id,
            anzahlPlaetze,
          },
        ],
      });
      setBookingSuccess(true);
      setShowConfirmModal(false);
      showToast('Buchung erfolgreich erstellt', 'success');
    } catch (error: any) {
      showToast(error.message || 'Fehler bei der Buchung', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading || !horaire) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (bookingSuccess) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Buchung erfolgreich!
            </h1>
            <p className="text-gray-600 mb-8">
              Ihre Buchung wurde erfolgreich erstellt. Sie finden alle Details in Ihren Buchungen.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" onClick={() => navigate('/bookings')}>
                Zu meinen Buchungen
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Neue Suche
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const gesamtpreis = horaire.prixIndividuel * anzahlPlaetze;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Buchungsdetails</h1>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fahrtinformationen</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <MapPin size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Strecke</p>
                <p className="text-lg font-semibold text-gray-900">
                  {horaire.trajet.depart} → {horaire.trajet.destination}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {horaire.trajet.distanceKm} km
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <Clock size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Abfahrt</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(horaire.dateDepart)}
                </p>
              </div>
            </div>

            {horaire.buses.length > 0 && (
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                <BusIcon size={24} className="text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Fahrzeug</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {horaire.buses[0].modele}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Kapazität: {horaire.buses[0].capacite} Plätze
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <Users size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Verfügbare Plätze</p>
                <p className="text-lg font-semibold text-gray-900">
                  {horaire.placesDisponibles} Plätze
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Anzahl Plätze</h2>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <span className="text-gray-700 font-medium">Plätze auswählen</span>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecrement}
                disabled={anzahlPlaetze <= 1}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border-2 border-gray-300 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                {anzahlPlaetze}
              </span>
              <button
                onClick={handleIncrement}
                disabled={anzahlPlaetze >= horaire.placesDisponibles}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border-2 border-gray-300 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preisübersicht</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Preis pro Person</span>
              <span>{horaire.prixIndividuel.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Anzahl Plätze</span>
              <span>× {anzahlPlaetze}</span>
            </div>
            <div className="border-t-2 border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-900">Gesamtpreis</span>
                <span className="text-3xl font-bold text-blue-600">
                  {gesamtpreis.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="flex-1" onClick={() => navigate(-1)}>
            Zurück
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => setShowConfirmModal(true)}
          >
            Jetzt buchen
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Buchung bestätigen"
      >
        <div className="space-y-6">
          <p className="text-gray-700">
            Möchten Sie diese Buchung wirklich durchführen?
          </p>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Strecke:</span>
              <span className="font-semibold">
                {horaire.trajet.depart} → {horaire.trajet.destination}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plätze:</span>
              <span className="font-semibold">{anzahlPlaetze}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Gesamtpreis:</span>
              <span className="text-blue-600">{gesamtpreis.toLocaleString()} FCFA</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setShowConfirmModal(false)}
              disabled={isBooking}
            >
              Abbrechen
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleBooking}
              isLoading={isBooking}
            >
              Bestätigen
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Booking;
