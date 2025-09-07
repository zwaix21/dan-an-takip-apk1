import React from 'react';
import { Customer } from '../types';
import { Users, Search, Plus } from 'lucide-react';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function CustomerList({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
  searchTerm,
  onSearchChange
}: CustomerListProps) {
  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
          </div>
          <button
            onClick={onAddCustomer}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => onSelectCustomer(customer)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
              selectedCustomer?.id === customer.id
                ? 'bg-blue-50 border-l-4 border-l-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="font-medium text-gray-900">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-sm text-gray-600 mt-1">{customer.email}</div>
            <div className="text-sm text-gray-600">{customer.phone}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                Registered: {new Date(customer.registrationDate).toLocaleDateString()}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                customer.balance > 0 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                ${customer.balance.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}