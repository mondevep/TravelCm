import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SearchHorairesRequest,
  Horaire,
  Reservation,
  CreateReservationRequest,
  ApiError,
} from '../types/api.types';

const API_BASE_URL = 'http://localhost:8081/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: (error.response.data as any)?.message || 'Ein Fehler ist aufgetreten',
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        message: 'Keine Verbindung zum Server. Bitte überprüfen Sie Ihre Internetverbindung.',
      };
    }
    return {
      message: error.message || 'Ein unbekannter Fehler ist aufgetreten',
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async searchHoraires(searchParams: SearchHorairesRequest): Promise<Horaire[]> {
    const response = await this.api.post<Horaire[]>('/horaires/search', searchParams);
    return response.data;
  }

  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    const response = await this.api.post<Reservation>('/reservations', data);
    return response.data;
  }

  async getMyReservations(): Promise<Reservation[]> {
    const response = await this.api.get<Reservation[]>('/reservations/my');
    return response.data;
  }

  async confirmReservation(id: number): Promise<Reservation> {
    const response = await this.api.post<Reservation>(`/reservations/${id}/confirm`);
    return response.data;
  }

  async cancelReservation(id: number): Promise<void> {
    await this.api.delete(`/reservations/${id}`);
  }
}

export default new ApiService();
