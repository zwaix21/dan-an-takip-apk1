import React from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

interface SessionHistoryProps {
  appointments: Appointment[];
}

export default function SessionHistory({ appointments }: SessionHistoryProps) {
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'no-show':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      case 'no-show': return 'Gelmedi';
      default: return 'Planlandı';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz seans kaydı yok</h3>
        <p className="text-gray-600">Bu danışan için henüz randevu oluşturulmamış.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Seans Geçmişi</h3>
        <span className="text-sm text-gray-600">{appointments.length} seans</span>
      </div>

      <div className="space-y-3">
        {sortedAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(appointment.status)}
                <div>
                  <div className="font-medium text-gray-900">
                    Seans #{appointment.sessionNumber} - {appointment.sessionType}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(appointment.date).toLocaleDateString('tr-TR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • {appointment.startTime} - {appointment.endTime}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
                <span className="font-medium text-gray-900">₺{appointment.cost.toFixed(2)}</span>
              </div>
            </div>
            
            {appointment.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}