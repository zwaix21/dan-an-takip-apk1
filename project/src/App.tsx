import React, { useState, useEffect } from 'react';
import { Client, Appointment, Payment } from './types';
import ClientList from './components/ClientList';
import ClientDetails from './components/ClientDetails';
import ClientForm from './components/ClientForm';
import CalendarView from './components/Calendar/CalendarView';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { LocalStorageManager, OfflineManager } from './utils/storage';
import { Calendar, Users } from 'lucide-react';

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'calendar' | 'clients'>('calendar');

  // PWA ve çevrimdışı desteği
  useEffect(() => {
    OfflineManager.init();
    
    // Verileri localStorage'dan yükle
    const storage = LocalStorageManager.getInstance();
    const savedClients = storage.getItem<Client[]>('clients');
    const savedAppointments = storage.getItem<Appointment[]>('appointments');
    const savedPayments = storage.getItem<Payment[]>('payments');
    
    if (savedClients) setClients(savedClients);
    if (savedAppointments) setAppointments(savedAppointments);
    if (savedPayments) setPayments(savedPayments);
  }, []);

  // Verileri localStorage'a kaydet
  useEffect(() => {
    const storage = LocalStorageManager.getInstance();
    storage.setItem('clients', clients);
  }, [clients]);

  useEffect(() => {
    const storage = LocalStorageManager.getInstance();
    storage.setItem('appointments', appointments);
  }, [appointments]);

  useEffect(() => {
    const storage = LocalStorageManager.getInstance();
    storage.setItem('payments', payments);
  }, [payments]);

  // Initialize with sample data
  useEffect(() => {
    // Sadece veri yoksa örnek verileri yükle
    if (clients.length > 0) return;
    
    const sampleClients: Client[] = [
      {
        id: '1',
        firstName: 'Ayşe',
        lastName: 'Yılmaz',
        email: 'ayse.yilmaz@example.com',
        phone: '0532 123 4567',
        address: 'Kadıköy, İstanbul',
        birthDate: '1985-03-15',
        registrationDate: '2024-01-15T00:00:00Z',
        notes: 'Anksiyete bozukluğu ile ilgili destek alıyor.',
        totalSessions: 12,
        completedSessions: 5,
        totalCharges: 3000.00,
        totalPaid: 2500.00,
        balance: 500.00,
        sessionRate: 500.00
      },
      {
        id: '2',
        firstName: 'Mehmet',
        lastName: 'Kaya',
        email: 'mehmet.kaya@example.com',
        phone: '0533 987 6543',
        address: 'Beşiktaş, İstanbul',
        birthDate: '1978-07-22',
        registrationDate: '2024-02-01T00:00:00Z',
        notes: 'Çift terapisi seansları.',
        totalSessions: 8,
        completedSessions: 3,
        totalCharges: 2400.00,
        totalPaid: 2400.00,
        balance: 0.00,
        sessionRate: 600.00
      }
    ];

    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Ayşe Yılmaz',
        date: '2024-12-20',
        startTime: '10:00',
        endTime: '11:00',
        sessionType: 'Bireysel Terapi',
        cost: 500.00,
        status: 'scheduled',
        notes: 'Anksiyete yönetimi teknikleri üzerinde çalışılacak.',
        sessionNumber: 6
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'Mehmet Kaya',
        date: '2024-12-21',
        startTime: '14:00',
        endTime: '15:30',
        sessionType: 'Çift Terapisi',
        cost: 600.00,
        status: 'scheduled',
        notes: 'İletişim becerileri geliştirme.',
        sessionNumber: 4
      },
      {
        id: '3',
        clientId: '1',
        clientName: 'Ayşe Yılmaz',
        date: '2024-12-15',
        startTime: '10:00',
        endTime: '11:00',
        sessionType: 'Bireysel Terapi',
        cost: 500.00,
        status: 'completed',
        notes: 'Nefes teknikleri öğretildi.',
        sessionNumber: 5
      }
    ];

    const samplePayments: Payment[] = [
      {
        id: '1',
        customerId: '1',
        amount: 1000.00,
        date: '2024-12-01',
        method: 'card',
        reference: 'TXN123456',
        description: '2 seans ödemesi'
      },
      {
        id: '2',
        customerId: '2',
        amount: 1800.00,
        date: '2024-12-05',
        method: 'bank_transfer',
        reference: 'HVL789012',
        description: '3 seans ödemesi'
      }
    ];

    setClients(sampleClients);
    setAppointments(sampleAppointments);
    setPayments(samplePayments);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
    if (editingClient) {
      const updatedClient = { ...clientData, id: editingClient.id };
      setClients(prev => prev.map(c => c.id === editingClient.id ? updatedClient : c));
      if (selectedClient?.id === editingClient.id) {
        setSelectedClient(updatedClient);
      }
    } else {
      const newClient = { ...clientData, id: generateId() };
      setClients(prev => [...prev, newClient]);
    }
    setShowClientForm(false);
    setEditingClient(null);
  };

  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointmentData, id: generateId() };
    setAppointments(prev => [...prev, newAppointment]);
    updateClientTotals(appointmentData.clientId);
  };

  const handleUpdateAppointment = (appointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === appointment.id ? appointment : a));
    updateClientTotals(appointment.clientId);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
      updateClientTotals(appointment.clientId);
    }
  };

  const handleAddPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment = { ...paymentData, id: generateId() };
    setPayments(prev => [...prev, newPayment]);
    updateClientTotals(paymentData.customerId);
  };

  const updateClientTotals = (clientId: string) => {
    const clientAppointments = appointments.filter(a => a.clientId === clientId);
    const clientPayments = payments.filter(p => p.customerId === clientId);
    
    const totalCharges = clientAppointments.reduce((sum, apt) => sum + apt.cost, 0);
    const totalPaid = clientPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const balance = totalCharges - totalPaid;
    const completedSessions = clientAppointments.filter(a => a.status === 'completed').length;

    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, totalCharges, totalPaid, balance, completedSessions }
        : client
    ));

    if (selectedClient?.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, totalCharges, totalPaid, balance, completedSessions } : null);
    }
  };

  const handleEditClient = () => {
    if (selectedClient) {
      setEditingClient(selectedClient);
      setShowClientForm(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={() => setActiveView('calendar')}
          className={`p-3 rounded-lg mb-2 transition-colors ${
            activeView === 'calendar' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Takvim"
        >
          <Calendar className="h-6 w-6" />
        </button>
        <button
          onClick={() => setActiveView('clients')}
          className={`p-3 rounded-lg transition-colors ${
            activeView === 'clients' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Danışanlar"
        >
          <Users className="h-6 w-6" />
        </button>
      </div>

      {activeView === 'calendar' ? (
        <CalendarView
          clients={clients}
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
          onUpdateAppointment={handleUpdateAppointment}
          onDeleteAppointment={handleDeleteAppointment}
        />
      ) : (
        <>
          <ClientList
            clients={clients}
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
            onAddClient={() => setShowClientForm(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {selectedClient ? (
            <ClientDetails
              client={selectedClient}
              appointments={appointments}
              payments={payments}
              onEditClient={handleEditClient}
              onAddPayment={handleAddPayment}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Danışan Yönetimi</h2>
                <p className="text-gray-600">Bir danışan seçin veya yeni danışan ekleyin.</p>
              </div>
            </div>
          )}
        </>
      )}

      <PWAInstallPrompt />
      <OfflineIndicator />

      {showClientForm && (
        <ClientForm
          client={editingClient}
          onSave={handleSaveClient}
          onCancel={() => {
            setShowClientForm(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
}

export default App;