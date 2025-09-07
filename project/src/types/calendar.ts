export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  category: 'appointment' | 'meeting' | 'personal' | 'work';
  attendees?: string[];
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