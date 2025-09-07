import React, { useState, useEffect } from 'react';
import { Customer, Charge, Appointment } from '../types';
import { X, Save } from 'lucide-react';

interface ChargeFormProps {
  customer: Customer;
  appointments: Appointment[];
  charge?: Charge | null;
  onSave: (charge: Omit<Charge, 'id'>) => void;
  onCancel: () => void;
}

export default function ChargeForm({ customer, appointments, charge, onSave, onCancel }: ChargeFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    appointmentId: '',
    isPaid: false
  });

  useEffect(() => {
    if (charge) {
      setFormData({
        description: charge.description,
        amount: charge.amount.toString(),
        date: charge.date,
        appointmentId: charge.appointmentId || '',
        isPaid: charge.isPaid
      });
    }
  }, [charge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      customerId: customer.id,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      appointmentId: formData.appointmentId || undefined,
      isPaid: formData.isPaid
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleAppointmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const appointmentId = e.target.value;
    setFormData({ ...formData, appointmentId });
    
    if (appointmentId) {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        setFormData(prev => ({
          ...prev,
          appointmentId,
          description: `Service: ${appointment.service}`,
          amount: appointment.cost.toString(),
          date: appointment.date
        }));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {charge ? 'Edit Charge' : 'Add New Charge'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link to Appointment (Optional)
              </label>
              <select
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleAppointmentSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select appointment...</option>
                {appointments.map(appointment => (
                  <option key={appointment.id} value={appointment.id}>
                    {appointment.service} - {new Date(appointment.date).toLocaleDateString()} at {appointment.startTime}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Service charge, consultation fee, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
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
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPaid"
                id="isPaid"
                checked={formData.isPaid}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-900">
                Mark as paid
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}