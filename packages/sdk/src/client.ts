import ky from 'ky';
import type { 
  ApiResponse, 
  Brand, 
  Service, 
  Appointment, 
  Client, 
  Stylist,
  CreateAppointmentRequest,
  AvailabilityRequest,
  AvailabilitySlot,
  Pagination 
} from './types';

export interface SalonXClientOptions {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export class SalonXClient {
  private api: typeof ky;

  constructor(options: SalonXClientOptions) {
    this.api = ky.create({
      prefixUrl: options.baseUrl,
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey && { Authorization: `Bearer ${options.apiKey}` }),
      },
      hooks: {
        beforeRequest: [
          (request) => {
            request.headers.set('X-Request-ID', crypto.randomUUID());
          },
        ],
        afterResponse: [
          async (request, options, response) => {
            if (!response.ok) {
              const error = await response.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
              throw new Error(error.message || `HTTP ${response.status}`);
            }
          },
        ],
      },
    });
  }

  async getBrandByHost(host: string): Promise<ApiResponse<Brand>> {
    return this.api.get('public/brand', { searchParams: { host } }).json();
  }

  async getServices(brandId: string): Promise<ApiResponse<Service[]>> {
    return this.api.get('public/services', { searchParams: { brandId } }).json();
  }

  async getAvailability(request: AvailabilityRequest): Promise<ApiResponse<AvailabilitySlot[]>> {
    return this.api.post('public/availability', { json: request }).json();
  }

  async createAppointment(request: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> {
    return this.api.post('public/appointments', { json: request }).json();
  }

  async createPaymentCheckout(appointmentId: string, successUrl: string, cancelUrl: string): Promise<ApiResponse<{ checkoutUrl: string }>> {
    return this.api.post('public/payments/checkout', {
      json: { appointmentId, successUrl, cancelUrl },
    }).json();
  }

  async getAppointments(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    date?: string;
  }): Promise<ApiResponse<Appointment[]>> {
    return this.api.get('admin/appointments', { searchParams: params }).json();
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.api.patch(`admin/appointments/${id}`, { json: updates }).json();
  }

  async parkAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return this.api.post(`admin/appointments/${id}/park`).json();
  }

  async returnAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return this.api.post(`admin/appointments/${id}/return`).json();
  }

  async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<Appointment>> {
    return this.api.post(`admin/appointments/${id}/cancel`, { json: { reason } }).json();
  }

  async rescheduleAppointment(id: string, newStartAt: string): Promise<ApiResponse<Appointment>> {
    return this.api.post(`admin/appointments/${id}/reschedule`, { json: { newStartAt } }).json();
  }

  async markAppointmentPaid(id: string): Promise<ApiResponse<Appointment>> {
    return this.api.post(`admin/appointments/${id}/mark-paid`).json();
  }

  async getClients(params?: Pagination): Promise<ApiResponse<Client[]>> {
    return this.api.get('admin/clients', { searchParams: params }).json();
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> {
    return this.api.post('admin/clients', { json: client }).json();
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<ApiResponse<Client>> {
    return this.api.patch(`admin/clients/${id}`, { json: updates }).json();
  }

  async getStylists(): Promise<ApiResponse<Stylist[]>> {
    return this.api.get('admin/stylists').json();
  }

  async createStylist(stylist: Omit<Stylist, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Stylist>> {
    return this.api.post('admin/stylists', { json: stylist }).json();
  }

  async updateStylist(id: string, updates: Partial<Stylist>): Promise<ApiResponse<Stylist>> {
    return this.api.patch(`admin/stylists/${id}`, { json: updates }).json();
  }

  async getReportsSummary(range: 'today' | '7d' | 'mtd'): Promise<ApiResponse<{
    totalRevenue: number;
    totalAppointments: number;
    completionRate: number;
    averageTicket: number;
  }>> {
    return this.api.get('admin/reports/summary', { searchParams: { range } }).json();
  }

  async exportAppointments(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    return this.api.get(`admin/exports/appointments.${format}`).blob();
  }

  async createEmailCampaign(campaign: {
    name: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    listId?: string;
    scheduledAt?: string;
  }): Promise<ApiResponse<any>> {
    return this.api.post('admin/email/campaigns', { json: campaign }).json();
  }

  async sendEmailCampaign(id: string): Promise<ApiResponse<any>> {
    return this.api.post(`admin/email/campaigns/${id}/send`).json();
  }

  async createSmsCampaign(campaign: {
    name: string;
    message: string;
    scheduledAt?: string;
  }): Promise<ApiResponse<any>> {
    return this.api.post('admin/sms/campaigns', { json: campaign }).json();
  }

  async sendSmsCampaign(id: string): Promise<ApiResponse<any>> {
    return this.api.post(`admin/sms/campaigns/${id}/send`).json();
  }

  async getWebsiteSettings(): Promise<ApiResponse<any>> {
    return this.api.get('admin/website').json();
  }

  async updateWebsiteSettings(settings: any): Promise<ApiResponse<any>> {
    return this.api.put('admin/website', { json: settings }).json();
  }

  async publishWebsite(): Promise<ApiResponse<any>> {
    return this.api.post('admin/website/publish').json();
  }
}

export function createSalonXClient(options: SalonXClientOptions): SalonXClient {
  return new SalonXClient(options);
}
