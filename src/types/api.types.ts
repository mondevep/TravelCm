export enum UserRole {
  ADMIN = 'ADMIN',
  AGENCE = 'AGENCE',
  PASSAGER = 'PASSAGER'
}

export enum ReservationStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRMEE = 'CONFIRMEE',
  ANNULEE = 'ANNULEE',
  TERMINEE = 'TERMINEE'
}

export interface User {
  id: number;
  nom: string;
  telephone: string;
  email: string;
  role: UserRole;
  agenceId?: number;
  dateCreation?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  telephone: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  telephone: string;
  email: string;
  password: string;
  role: UserRole;
  agenceId?: number;
}

export interface Agence {
  id: number;
  nomAgence: string;
  adresse: string;
  telephone: string;
  email: string;
  dateCreation?: string;
}

export interface Bus {
  id: number;
  immatriculation: string;
  capacite: number;
  modele: string;
  agenceId: number;
  agence?: Agence;
  dateCreation?: string;
}

export interface Trajet {
  id: number;
  depart: string;
  destination: string;
  distanceKm: number;
  prixBase: number;
  dateCreation?: string;
}

export interface Horaire {
  id: number;
  trajetId: number;
  trajet: Trajet;
  dateDepart: string;
  prixIndividuel: number;
  placesDisponibles: number;
  buses: Bus[];
  dateCreation?: string;
}

export interface SearchHorairesRequest {
  depart: string;
  destination: string;
  date: string;
  minPlaces?: number;
}

export interface ReservationDetail {
  id?: number;
  horaireId: number;
  anzahlPlaetze: number;
  horaire?: Horaire;
  prixTotal?: number;
}

export interface Reservation {
  id: number;
  utilisateurId: number;
  utilisateur?: User;
  status: ReservationStatus;
  prixTotal: number;
  dateReservation: string;
  details: ReservationDetail[];
}

export interface CreateReservationRequest {
  details: Array<{
    horaireId: number;
    anzahlPlaetze: number;
  }>;
}

export interface ApiError {
  message: string;
  status?: number;
}
