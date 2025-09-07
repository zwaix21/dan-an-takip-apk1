import React, { useState } from 'react';
import { Customer, Appointment, Charge, Payment } from '../types';
import { Calendar, CreditCard, DollarSign, User, Phone, Mail, MapPin, Edit } from 'lucide-react';
import AppointmentScheduler from './AppointmentScheduler';
import BillingSection from './BillingSection';

interface CustomerDetailsProps {
  customer: Customer;
  appointments: Appointment[];
  charges: Charge[];
  payments: Payment[];
  onEditCustomer: () => void;
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onAddCharge: (charge: Omit<Charge, 'id'>) => void;
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
  onUpdateCharge: (charge: Charge) => void;
}

export default function CustomerDetails({
  customer,
  appointments,
  charges,
  payments,
  onEditCustomer,
  onAddAppointment,
  onUpdateAppointment,
  onAddCharge,
  onAddPayment,
  onUpdateCharge
}: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'billing'>('profile');

  const customerAppointments = appointments.filter(apt => apt.customerId === customer.id);
  const customerCharges = charges.filter(charge => charge.customerId === customer.id);
  const customerPayments = payments.filter(payment => payment.customerId === customer.id);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-gray-600">{customer.email}</p>
            </div>
          </div>
          <button
            onClick={onEditCustomer}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'billing', label: 'Billing', icon: CreditCard }
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
      <div className="flex-1 overflow-auto">
        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-900">{customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-900">{customer.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-500 mr-3 mt-1" />
                    <span className="text-gray-900">{customer.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Charges:</span>
                    <span className="font-medium text-gray-900">${customer.totalCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-medium text-gray-900">${customer.totalPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Balance:</span>
                    <span className={`font-bold ${customer.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${customer.balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="text-gray-900">
                      {new Date(customer.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <AppointmentScheduler
            customer={customer}
            appointments={customerAppointments}
            onAddAppointment={onAddAppointment}
            onUpdateAppointment={onUpdateAppointment}
          />
        )}

        {activeTab === 'billing' && (
          <BillingSection
            customer={customer}
            charges={customerCharges}
            payments={customerPayments}
            appointments={customerAppointments}
            onAddCharge={onAddCharge}
            onAddPayment={onAddPayment}
            onUpdateCharge={onUpdateCharge}
          />
        )}
      </div>
    </div>
  );
}