import React, { useState } from 'react';
import { Client, Payment } from '../types';
import { CreditCard, Plus, Calendar, DollarSign } from 'lucide-react';
import PaymentForm from './PaymentForm';

interface PaymentHistoryProps {
  client: Client;
  payments: Payment[];
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
}

export default function PaymentHistory({ client, payments, onAddPayment }: PaymentHistoryProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const sortedPayments = [...payments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAddPayment = (paymentData: Omit<Payment, 'id'>) => {
    onAddPayment(paymentData);
    setShowPaymentForm(false);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Nakit';
      case 'card': return 'Kart';
      case 'bank_transfer': return 'Havale';
      default: return method;
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="ml-2 text-sm font-medium text-blue-600">Toplam Borç</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">₺{client.totalCharges.toFixed(2)}</span>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-green-600" />
            <span className="ml-2 text-sm font-medium text-green-600">Toplam Ödenen</span>
          </div>
          <span className="text-2xl font-bold text-green-900">₺{totalPaid.toFixed(2)}</span>
        </div>
        
        <div className={`rounded-lg p-4 ${client.balance > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
          <div className="flex items-center">
            <DollarSign className={`h-5 w-5 ${client.balance > 0 ? 'text-red-600' : 'text-gray-600'}`} />
            <span className={`ml-2 text-sm font-medium ${client.balance > 0 ? 'text-red-600' : 'text-gray-600'}`}>
              Bakiye
            </span>
          </div>
          <span className={`text-2xl font-bold ${client.balance > 0 ? 'text-red-900' : 'text-gray-900'}`}>
            ₺{client.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ödeme Geçmişi</h3>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ödeme Ekle
          </button>
        </div>

        {sortedPayments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {sortedPayments.map((payment) => (
              <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getPaymentMethodLabel(payment.method)}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(payment.date).toLocaleDateString('tr-TR')}
                      </div>
                      {payment.reference && (
                        <div className="text-xs text-gray-500">
                          Ref: {payment.reference}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">
                      ₺{payment.amount.toFixed(2)}
                    </div>
                    {payment.description && (
                      <div className="text-xs text-gray-500">
                        {payment.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ödeme kaydı yok</h3>
            <p className="text-gray-600 mb-4">Bu danışan için henüz ödeme kaydedilmemiş.</p>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk Ödemeyi Ekle
            </button>
          </div>
        )}
      </div>

      {showPaymentForm && (
        <PaymentForm
          client={client}
          onSave={handleAddPayment}
          onCancel={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
}