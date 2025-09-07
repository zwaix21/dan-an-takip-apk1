import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../../types/calendar';
import { X, Save, Clock, User, FileText } from 'lucide-react';

interface EventFormProps {
  event?: CalendarEvent | null;
  selectedDate?: string;
  selectedTime?: string;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
}

type Category = 'appointment' | 'meeting' | 'personal' | 'work';

export default function EventForm({ 
  event, 
  selectedDate, 
  selectedTime, 
  onSave, 
  onCancel 
}: EventFormProps) {
  const [formData, setFormData] = useState<CalendarEvent>({
    title: '',
    description: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    startTime: selectedTime || '09:00',
    endTime: '10:00',
    category: 'appointment',
    color: '#3B82F6',
    attendees: []
  });

  const [attendeeInput, setAttendeeInput] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        attendees: event.attendees || []
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      attendees: formData.attendees.length > 0 ? formData.attendees : undefined
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addAttendee = () => {
    const name = attendeeInput.trim();
    if (name && !formData.attendees.includes(name)) {
      setFormData(prev => ({ ...prev, attendees: [...prev.attendees, name] }));
      setAttendeeInput('');
    }
  };

  const removeAttendee = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== attendee)
    }));
  };

  const categoryColors: Record<Category, string> = {
    appointment: '#3B82F6',
    meeting: '#10B981',
    personal: '#F59E0B',
    work: '#EF4444'
  };

  const categoryLabels: Record<Category, string> = {
    appointment: 'Randevu',
    meeting: 'Toplantı',
    personal: 'Kişisel',
    work: 'İş'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {event ? 'Randevuyu Düzenle' : 'Yeni Randevu'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="h-4 w-4 inline mr-1" /> Başlık
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Randevu başlığı"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Randevu detayları..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
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
                <Clock className="h-4 w-4 inline mr-1" /> Başlangıç
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                const category = e.target.value as Category;
                setFormData(prev => ({ ...prev, category, color: categoryColors[category] }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
            <div className="flex space-x-2">
              {Object.values(categoryColors).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="h-4 w-4 inline mr-1" /> Katılımcılar
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                placeholder="Katılımcı adı"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addAttendee}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ekle
              </button>
            </div>

            {formData.attendees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.attendees.map((attendee) => (
                  <span key={attendee} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {attendee}
                    <button type="button" onClick={() => removeAttendee(attendee)} className="ml-2 text-blue-600 hover:text-blue-800">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              İptal
            </button>
            <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Save className="h-4 w-4 mr-2" /> Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
