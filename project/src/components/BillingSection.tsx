import React, { useState } from 'react';
import { Customer, Charge, Payment, Appointment } from '../types';
import { Plus, DollarSign, Receipt, CreditCard } from 'lucide-react';
import ChargeForm from './ChargeForm';
import PaymentForm from './PaymentForm';

interface BillingSectionProps {
  customer: Customer;
  charges: Charge[];
  payments: Payment[];
  appointments: Appointment[];
  onAddCharge: (charge: Omit<Charge, 'id'>) => void;
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
  onUpdateCharge: (charge: Charge) => void;
}

export default function BillingSection({
  customer,
  charges,
  payments,
  appointments,
  onAddCharge,
  onAddPayment,
  onUpdateCharge
}: BillingSectionProps) {
  const [showChargeForm, setShowChargeForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);

  const handleAddCharge = (chargeData: Omit<Charge, 'id'>) => {
    onAddCharge(chargeData);
    setShowChargeForm(false);
  };

  const handleUpdateCharge = (chargeData: Omit<Charge, 'id'>) => {
    if (editingCharge) {
      onUpdateCharge({ ...chargeData, id: editingCharge.id });
    }
    setEditingCharge(null);
  };

  const handleAddPayment = (paymentData: Omit<Payment, 'id'>) => {
    onAddPayment(paymentData);
    setShowPaymentForm(false);
  };

  const unpaidCharges = charges.filter(charge => !charge.isPaid);
  const paidCharges = charges.filter(charge => charge.isPaid);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Billing & Payments</h2>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowChargeForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Charge
          </button>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="ml-2 text-sm font-medium text-blue-600">Total Charges</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">${customer.totalCharges.toFixed(2)}</span>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Receipt className="h-5 w-5 text-green-600" />
            <span className="ml-2 text-sm font-medium text-green-600">Total Paid</span>
          </div>
          <span className="text-2xl font-bold text-green-900">${customer.totalPaid.toFixed(2)}</span>
        </div>
        
        <div className={`rounded-lg p-4 ${customer.balance > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
          <div className="flex items-center">
            <DollarSign className={`h-5 w-5 ${customer.balance > 0 ? 'text-red-600' : 'text-gray-600'}`} />
            <span className={`ml-2 text-sm font-medium ${customer.balance > 0 ? 'text-red-600' : 'text-gray-600'}`}>
              Balance
            </span>
          </div>
          <span className={`text-2xl font-bold ${customer.balance > 0 ? 'text-red-900' : 'text-gray-900'}`}>
            ${customer.balance.toFixed(2)}
          </span>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <Receipt className="h-5 w-5 text-yellow-600" />
            <span className="ml-2 text-sm font-medium text-yellow-600">Unpaid</span>
          </div>
          <span className="text-2xl font-bold text-yellow-900">
            ${unpaidCharges.reduce((sum, charge) => sum + charge.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unpaid Charges */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Unpaid Charges</h3>
          </div>
          <div className="p-4">
            {unpaidCharges.length > 0 ? (
              <div className="space-y-3">
                {unpaidCharges.map((charge) => (
                  <div key={charge.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{charge.description}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(charge.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-red-600">${charge.amount.toFixed(2)}</span>
                      <button
                        onClick={() => onUpdateCharge({ ...charge, isPaid: true })}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                      >
                        Mark Paid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No unpaid charges</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          </div>
          <div className="p-4">
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{payment.method.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                      {payment.reference && (
                        <div className="text-xs text-gray-500">Ref: {payment.reference}</div>
                      )}
                    </div>
                    <span className="font-bold text-green-600">${payment.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No payments recorded</p>
            )}
          </div>
        </div>
      </div>

      {/* All Charges History */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Charge History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {charges.map((charge) => (
                <tr key={charge.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(charge.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{charge.description}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    ${charge.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      charge.isPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {charge.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!charge.isPaid && (
                      <button
                        onClick={() => onUpdateCharge({ ...charge, isPaid: true })}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showChargeForm || editingCharge) && (
        <ChargeForm
          customer={customer}
          appointments={appointments}
          charge={editingCharge}
          onSave={editingCharge ? handleUpdateCharge : handleAddCharge}
          onCancel={() => {
            setShowChargeForm(false);
            setEditingCharge(null);
          }}
        />
      )}

      {showPaymentForm && (
        <PaymentForm
          customer={customer}
          onSave={handleAddPayment}
          onCancel={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
}