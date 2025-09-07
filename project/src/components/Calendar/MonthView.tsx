import React from 'react';
import { CalendarDay, CalendarEvent } from '../../types/calendar';

interface MonthViewProps {
  days: CalendarDay[];
  onDayClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function MonthView({ days, onDayClick, onEventClick }: MonthViewProps) {
  const weekDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Hafta günleri başlığı */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div key={day} className="p-4 text-center">
            <span className="text-sm font-medium text-gray-700">{day}</span>
          </div>
        ))}
      </div>

      {/* Takvim günleri */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <div
            key={`${day.date}-${index}`}
            onClick={() => onDayClick(day.date)}
            className={`min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors 
                        ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''} 
                        ${day.isToday ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-medium ${
                  day.isToday
                    ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                    : day.isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {day.dayNumber}
              </span>
            </div>

            <div className="space-y-1">
              {day.events.slice(0, 3).map((event: CalendarEvent) => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: event.color + '20', color: event.color }}
                  title={event.title}
                >
                  <div className="font-medium">{event.startTime}</div>
                  <div className="truncate">{event.title}</div>
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-gray-500 font-medium">
                  +{day.events.length - 3} daha
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
