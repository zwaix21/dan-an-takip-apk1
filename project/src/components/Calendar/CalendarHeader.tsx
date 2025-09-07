import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'week' | 'day';
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: 'week' | 'day') => void;
  onAddEvent: () => void;
}

export default function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onAddEvent
}: CalendarHeaderProps) {

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    
    if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}`;
    }
    
    if (view === 'day') {
      return currentDate.toLocaleDateString('tr-TR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    return currentDate.toLocaleDateString('tr-TR', options);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Randevu Takvimi</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button onClick={onPrevious} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <button onClick={onToday} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Bugün
            </button>
            
            <button onClick={onNext} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800">
            {formatDate()}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'day'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => onViewChange(viewType)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  view === viewType
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {viewType === 'week' ? 'Hafta' : 'Gün'}
              </button>
            ))}
          </div>
          
          <button
            onClick={onAddEvent}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Randevu Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
