export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  registrationDate: string;
  notes: string;
  totalSessions: number;
  completedSessions: number;
  totalCharges: number;
  totalPaid: number;
  balance: number;
  sessionRate: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  cost: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  sessionNumber: number;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'bank_transfer';
  reference: string;
  description: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  type: 'appointment' | 'break' | 'meeting';
  clientId?: string;
  appointmentId?: string;
}

export interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
}

export interface CalendarDay {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}