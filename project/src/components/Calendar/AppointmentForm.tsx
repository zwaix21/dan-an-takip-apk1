import React, { useState, useEffect } from 'react';
import { Client, Appointment } from '../../types';
import { X, Save, Trash2, User, Clock, FileText } from 'lucide-react';

interface AppointmentFormProps {
  clients: Client[];
  appointment?: Appointment | null;
  selectedDate?: string;
  selectedTime?: string;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function AppointmentForm({
  clients,
  appointment,
  selectedDate,
  selectedTime,
  onSave,
  onCancel,
  onDelete
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    startTime: selectedTime || '09:00',
    endTime: '10:00',
    sessionType: 'Bireysel Terapi',
    cost: '500',
    status: 'scheduled' as const,
    notes: '',
    sessionNumber: 1
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        clientId: appointment.clientId,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        sessionType: appointment.sessionType,
        cost: appointment.cost.toString(),
        status: appointment.status,
        notes: appointment.notes,
        sessionNumber: appointment.sessionNumber
      });
    } else if (selectedTime) {
      // Calculate end time (1 hour later)
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const endHour = hours + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, endTime }));
    }
  }, [appointment, selectedTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find(c => c.id === formData.clientId);
    if (!selectedClient) return;

    onSave({
      clientId: formData.clientId,
      clientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      sessionType: formData.sessionType,
      cost: parseFloat(formData.cost),
      status: formData.status,
      notes: formData.notes,
      sessionNumber: formData.sessionNumber
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill cost when client is selected
    if (name === 'clientId') {
      const selectedClient = clients.find(c => c.id === value);
      if (selectedClient) {
        setFormData(prev => ({ 
          ...prev, 
          cost: selectedClient.sessionRate.toString(),
          sessionNumber: selectedClient.completedSessions + 1
        }));
      }
    }
  };

  const sessionTypes = [
    'Bireysel Terapi',
    'Çift Terapisi',
    'Aile Terapisi',
    'Grup Terapisi',
    'Değerlendirme',
    'Konsültasyon'
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Planlandı', color: 'text-blue-600' },
    { value: 'completed', label: 'Tamamlandı', color: 'text-green-600' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'text-red-600' },
    { value: 'no-show', label: 'Gelmedi', color: 'text-yellow-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {appointment ? 'Randevuyu Düzenle' : 'Yeni Randevu'}
          </h3>
          <div className="flex items-center space-x-2">
            {appointment && onDelete && (
              <button
                onClick={onDelete}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 inline mr-1" />
                Danışan *
              </label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Danışan seçin...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Başlangıç
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seans Türü
                </label>
                <select
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sessionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seans No
                </label>
                <input
                  type="number"
                  name="sessionNumber"
                  value={formData.sessionNumber}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ücret (₺)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="h-4 w-4 inline mr-1" />
                Notlar
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seans notları..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}