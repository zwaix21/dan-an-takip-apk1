import React, { useState } from 'react';
import { Client, Appointment, Payment } from '../types';
import { User, Phone, Mail, MapPin, Calendar, CreditCard, Edit, TrendingUp } from 'lucide-react';
import SessionHistory from './SessionHistory';
import PaymentHistory from './PaymentHistory';

interface ClientDetailsProps {
  client: Client;
  appointments: Appointment[];
  payments: Payment[];
  onEditClient: () => void;
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
}

export default function ClientDetails({
  client,
  appointments,
  payments,
  onEditClient,
  onAddPayment
}: ClientDetailsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'sessions' | 'payments'>('profile');

  const clientAppointments = appointments.filter(apt => apt.clientId === client.id);
  const clientPayments = payments.filter(payment => payment.customerId === client.id);
  const completedSessions = clientAppointments.filter(apt => apt.status === 'completed').length;
  const upcomingSessions = clientAppointments.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.date) >= new Date()
  ).length;

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">
                {client.firstName} {client.lastName}
              </h1>
              <p className="text-blue-100">
                {calculateAge(client.birthDate) && `${calculateAge(client.birthDate)} yaş • `}
                Kayıt: {new Date(client.registrationDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
          <button
            onClick={onEditClient}
            className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-200" />
              <span className="ml-2 text-sm text-blue-200">Tamamlanan</span>
            </div>
            <span className="text-2xl font-bold">{completedSessions}</span>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-200" />
              <span className="ml-2 text-sm text-blue-200">Kalan</span>
            </div>
            <span className="text-2xl font-bold">{client.totalSessions - completedSessions}</span>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-blue-200" />
              <span className="ml-2 text-sm text-blue-200">Bakiye</span>
            </div>
            <span className={`text-2xl font-bold ${client.balance > 0 ? 'text-red-200' : 'text-green-200'}`}>
              ₺{client.balance.toFixed(2)}
            </span>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-200" />
              <span className="ml-2 text-sm text-blue-200">Yaklaşan</span>
            </div>
            <span className="text-2xl font-bold">{upcomingSessions}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'sessions', label: 'Seanslar', icon: Calendar },
            { id: 'payments', label: 'Ödemeler', icon: CreditCard }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-gray-900">{client.email || 'Belirtilmemiş'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-gray-900">{client.phone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-3 mt-1" />
                  <span className="text-gray-900">{client.address || 'Belirtilmemiş'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seans Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Seans Ücreti:</span>
                  <span className="font-medium text-gray-900">₺{client.sessionRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Seans:</span>
                  <span className="font-medium text-gray-900">{client.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tamamlanan:</span>
                  <span className="font-medium text-gray-900">{completedSessions}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">İlerleme:</span>
                  <span className="font-medium text-gray-900">
                    %{Math.round((completedSessions / client.totalSessions) * 100)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSessions / client.totalSessions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {client.notes && (
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notlar</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <SessionHistory appointments={clientAppointments} />
        )}

        {activeTab === 'payments' && (
          <PaymentHistory 
            client={client}
            payments={clientPayments} 
            onAddPayment={onAddPayment}
          />
        )}
      </div>
    </div>
  );
}