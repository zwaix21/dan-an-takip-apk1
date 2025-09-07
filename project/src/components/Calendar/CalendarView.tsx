import React, { useState, useEffect } from 'react';
import { CalendarEvent, TimeSlot, Client, Appointment } from '../../types';
import CalendarHeader from './CalendarHeader';
import WeekView from './WeekView';
import DayView from './DayView';
import AppointmentForm from './AppointmentForm';

interface CalendarViewProps {
  clients: Client[];
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export default function CalendarView({
  clients,
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setEvents(appointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.clientName} - ${appointment.sessionType}`,
      description: appointment.notes,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      date: appointment.date,
      color: getStatusColor(appointment.status),
      type: 'appointment',
      clientId: appointment.clientId,
      appointmentId: appointment.id
    })));
  }, [appointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'no-show': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, hour, minute: 0 });
      slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, hour, minute: 30 });
    }
    return slots;
  };

  const getWeekDays = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const handlePrevious = () => setCurrentDate(d => { const nd = new Date(d); nd.setDate(d.getDate() - (view==='week'?7:1)); return nd; });
  const handleNext = () => setCurrentDate(d => { const nd = new Date(d); nd.setDate(d.getDate() + (view==='week'?7:1)); return nd; });
  const handleToday = () => setCurrentDate(new Date());

  const handleTimeSlotClick = (date: string, time: string) => { setSelectedDate(date); setSelectedTime(time); setShowAppointmentForm(true); };
  const handleEventClick = (event: CalendarEvent) => { if (event.appointmentId) { const apt = appointments.find(a => a.id===event.appointmentId); if(apt){setEditingAppointment(apt); setShowAppointmentForm(true);} } };

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    if (editingAppointment) onUpdateAppointment({ ...appointmentData, id: editingAppointment.id });
    else onAddAppointment(appointmentData);
    setShowAppointmentForm(false); setEditingAppointment(null); setSelectedDate(''); setSelectedTime('');
  };

  const handleDeleteAppointment = () => { if(editingAppointment){ onDeleteAppointment(editingAppointment.id); setShowAppointmentForm(false); setEditingAppointment(null); } };

  const timeSlots = generateTimeSlots();
  const weekDays = getWeekDays(currentDate);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={setView}
        onAddEvent={() => setShowAppointmentForm(true)}
      />

      <div className="flex-1 p-6 overflow-auto">
        {view==='week' ? (
          <WeekView weekDays={weekDays} events={events} timeSlots={timeSlots} onTimeSlotClick={handleTimeSlotClick} onEventClick={handleEventClick} />
        ) : (
          <DayView date={currentDate} events={events.filter(e => e.date === currentDate.toISOString().split('T')[0])} timeSlots={timeSlots} onTimeSlotClick={handleTimeSlotClick} onEventClick={handleEventClick} />
        )}
      </div>

      {showAppointmentForm && (
        <AppointmentForm
          clients={clients}
          appointment={editingAppointment}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSave={handleSaveAppointment}
          onCancel={() => { setShowAppointmentForm(false); setEditingAppointment(null); setSelectedDate(''); setSelectedTime(''); }}
          onDelete={editingAppointment ? handleDeleteAppointment : undefined}
        />
      )}
    </div>
  );
}
