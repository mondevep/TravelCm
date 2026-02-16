import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import apiService from '../services/api.service';
import { Reservation, ReservationStatus } from '../types/api.types';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Bookings = () => {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | ReservationStatus>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getMyReservations();
      setReservations(data);
    } catch (error: any) {
      showToast(error.message || 'Fehler beim Laden der Buchungen', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedReservation) return;

    setIsConfirming(true);
    try {
      await apiService.confirmReservation(selectedReservation.id);
      showToast('Buchung erfolgreich bestätigt', 'success');
      setShowConfirmModal(false);
      fetchReservations();
    } catch (error: any) {
      showToast(error.message || 'Fehler beim Bestätigen', 'error');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedReservation) return;

    setIsCanceling(true);
    try {
      await apiService.cancelReservation(selectedReservation.id);
      showToast('Buchung erfolgreich storniert', 'success');
      setShowCancelModal(false);
      fetchReservations();
    } catch (error: any) {
      showToast(error.message || 'Fehler beim Stornieren', 'error');
    } finally {
      setIsCanceling(false);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const styles = {
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMEE: 'bg-green-100 text-green-800 border-green-200',
      ANNULEE: 'bg-red-100 text-red-800 border-red-200',
      TERMINEE: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const labels = {
      EN_ATTENTE: 'Ausstehend',
      CONFIRMEE: 'Bestätigt',
      ANNULEE: 'Storniert',
      TERMINEE: 'Abgeschlossen',
    };

    const icons = {
      EN_ATTENTE: <AlertCircle size={16} />,
      CONFIRMEE: <CheckCircle size={16} />,
      ANNULEE: <XCircle size={16} />,
      TERMINEE: <CheckCircle size={16} />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}
      >
        {icons[status]}
        {labels[status]}
      </span>
    );
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Meine Buchungen</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Alle ({reservations.length})
          </button>
          <button
            onClick={() => setFilter(ReservationStatus.EN_ATTENTE)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === ReservationStatus.EN_ATTENTE
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Ausstehend ({reservations.filter((r) => r.status === ReservationStatus.EN_ATTENTE).length})
          </button>
          <button
            onClick={() => setFilter(ReservationStatus.CONFIRMEE)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === ReservationStatus.CONFIRMEE
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Bestätigt ({reservations.filter((r) => r.status === ReservationStatus.CONFIRMEE).length})
          </button>
          <button
            onClick={() => setFilter(ReservationStatus.TERMINEE)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === ReservationStatus.TERMINEE
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Abgeschlossen ({reservations.filter((r) => r.status === ReservationStatus.TERMINEE).length})
          </button>
        </div>

        {filteredReservations.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Keine Buchungen gefunden</h3>
            <p className="text-gray-600 mb-6">
              Sie haben noch keine Buchungen. Starten Sie jetzt Ihre erste Suche!
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Jetzt suchen
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Buchung #{reservation.id}
                        </h3>
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>

                    {reservation.details.map((detail) => (
                      <div key={detail.id} className="border-l-4 border-blue-600 pl-4">
                        {detail.horaire && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin size={18} />
                              <span className="font-semibold">
                                {detail.horaire.trajet.depart} → {detail.horaire.trajet.destination}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={18} />
                              <span>{formatDate(detail.horaire.dateDepart)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users size={18} />
                              <span>{detail.anzahlPlaetze} Plätze</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="text-sm text-gray-500">
                      Gebucht am: {formatDate(reservation.dateReservation)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-4 lg:min-w-[200px]">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Gesamtpreis</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reservation.prixTotal.toLocaleString()} FCFA
                      </p>
                    </div>

                    {reservation.status === ReservationStatus.EN_ATTENTE && (
                      <div className="flex flex-col gap-2 w-full">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowConfirmModal(true);
                          }}
                        >
                          Bestätigen
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowCancelModal(true);
                          }}
                        >
                          Stornieren
                        </Button>
                      </div>
                    )}

                    {reservation.status === ReservationStatus.CONFIRMEE && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowCancelModal(true);
                        }}
                      >
                        Stornieren
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Buchung bestätigen"
      >
        <div className="space-y-6">
          <p className="text-gray-700">
            Möchten Sie diese Buchung wirklich bestätigen?
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setShowConfirmModal(false)}
              disabled={isConfirming}
            >
              Abbrechen
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleConfirm}
              isLoading={isConfirming}
            >
              Bestätigen
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Buchung stornieren"
      >
        <div className="space-y-6">
          <p className="text-gray-700">
            Möchten Sie diese Buchung wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setShowCancelModal(false)}
              disabled={isCanceling}
            >
              Abbrechen
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleCancel}
              isLoading={isCanceling}
            >
              Stornieren
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Bookings;
