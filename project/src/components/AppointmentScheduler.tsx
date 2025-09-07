import React, { useState } from 'react';
import { Customer, Appointment } from '../types';
import { Calendar, Clock, Plus, Edit } from 'lucide-react';
import AppointmentForm from './AppointmentForm';

interface AppointmentSchedulerProps {
  customer: Customer;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
}

export default function AppointmentScheduler({
  customer,
  appointments,
  onAddAppointment,
  onUpdateAppointment
}: AppointmentSchedulerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Zaman slotlarını üret
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  // Seçilen günün haftasını al
  const getDaysInWeek = (startDate: string) => {
    const start = new Date(startDate);
    const startOfWeek = new Date(start);
    startOfWeek.setDate(start.getDate() - start.getDay());

    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day.toISOString().split('T')[0]);
    }
    return days;
  };

  // Bir slotta randevu varsa getir
  const getAppointmentForSlot = (date: string, time: string) =>
    appointments.find(apt => apt.date === date && apt.startTime === time);

  // Formu kaydet
  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    onAddAppointment(appointmentData);
    setShowForm(false);
  };

  const handleUpdateAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    if (editingAppointment) {
      onUpdateAppointment({ ...appointmentData, id: editingAppointment.id });
      setEditingAppointment(null);
    }
  };

  const timeSlots = getTimeSlots();
  const weekDays = getDaysInWeek(selectedDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6">
      {/* Başlık ve Yeni Randevu Butonu */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </button>
      </div>

      {/* Tarih Seçici */}
      <div className="mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Haftalık Takvim */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
          <div className="p-3 text-sm font-medium text-gray-500">Time</div>
          {weekDays.map((date, index) => (
            <div key={date} className="p-3 text-sm font-medium text-gray-900 text-center">
              <div>{dayNames[index]}</div>
              <div className="text-xs text-gray-500">{new Date(date).getDate()}</div>
            </div>
          ))}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-3 text-sm text-gray-600 bg-gray-50 font-medium">{time}</div>
              {weekDays.map((date) => {
                const appointment = getAppointmentForSlot(date, time);
                return (
                  <div
                    key={`${date}-${time}`}
                    className="p-2 border-l border-gray-100 min-h-[3rem] relative cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {appointment && (
                      <div
                        className={`absolute inset-1 rounded px-2 py-1 text-xs ${
                          appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                        onClick={() => setEditingAppointment(appointment)}
                      >
                        <div className="font-medium truncate">{appointment.service}</div>
                        <div className="text-xs opacity-75">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
        <div className="space-y-3">
          {appointments.slice(0, 5).map((apt) => (
            <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">{apt.service}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(apt.date).toLocaleDateString()} at {apt.startTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  apt.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : apt.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {apt.status}
                </span>
                <span className="font-medium text-gray-900">${apt.cost.toFixed(2)}</span>
                <button
                  onClick={() => setEditingAppointment(apt)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Form Modal */}
      {(showForm || editingAppointment) && (
        <AppointmentForm
          customer={customer}
          appointment={editingAppointment}
          onSave={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
          onCancel={() => {
            setShowForm(false);
            setEditingAppointment(null);
          }}
        />
      )}
    </div>
  );
}
