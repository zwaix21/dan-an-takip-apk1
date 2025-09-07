import React from 'react';
import { Client } from '../types';
import { Users, Search, Plus, User } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function ClientList({
  clients,
  selectedClient,
  onSelectClient,
  onAddClient,
  searchTerm,
  onSearchChange
}: ClientListProps) {
  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Danışanlar</h2>
          </div>
          <button
            onClick={onAddClient}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ekle
          </button>
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Danışan ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
              selectedClient?.id === client.id
                ? 'bg-blue-50 border-l-4 border-l-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {client.firstName} {client.lastName}
                </div>
                <div className="text-sm text-gray-600">{client.phone}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-100 rounded px-2 py-1">
                <span className="text-gray-600">Seans: </span>
                <span className="font-medium">{client.completedSessions}/{client.totalSessions}</span>
              </div>
              <div className={`rounded px-2 py-1 ${
                client.balance > 0 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                <span className="font-medium">₺{client.balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}