import React from 'react';
import { CalendarEvent, TimeSlot } from '../../types';

interface WeekViewProps {
  weekDays: Date[];
  events: CalendarEvent[];
  timeSlots: TimeSlot[];
  onTimeSlotClick: (date: string, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function WeekView({
  weekDays,
  events,
  timeSlots,
  onTimeSlotClick,
  onEventClick
}: WeekViewProps) {
  // Belirli bir tarih ve saate ait etkinlikleri döndür
  const getEventsForDateTime = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event =>
      event.date === dateStr && event.startTime === time
    );
  };

  // Tarih formatlayıcı
  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    return {
      dayName: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString('tr-TR', { month: 'short' }),
      isToday
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Hafta günleri başlığı */}
      <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
        <div className="p-4 text-center border-r border-gray-200">
          <span className="text-sm font-medium text-gray-600">Saat</span>
        </div>
        {weekDays.map((date, index) => {
          const formatted = formatDate(date);
          return (
            <div
              key={index}
              className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                formatted.isToday ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`text-sm font-medium ${formatted.isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                {formatted.dayName}
              </div>
              <div className={`text-lg font-bold ${formatted.isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                {formatted.dayNumber}
              </div>
              <div className="text-xs text-gray-500">{formatted.monthName}</div>
              {formatted.isToday && (
                <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Zaman slotları */}
      <div className="max-h-[600px] overflow-y-auto">
        {timeSlots.map((slot) => (
          <div key={slot.time} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50">
            <div className="p-3 text-center border-r border-gray-200 bg-gray-50">
              <span className="text-sm font-medium text-gray-600">{slot.time}</span>
            </div>
            {weekDays.map((date) => {
              const dayEvents = getEventsForDateTime(date, slot.time);
              const dateStr = date.toISOString().split('T')[0];

              return (
                <div
                  key={`${dateStr}-${slot.time}`}
                  onClick={() => onTimeSlotClick(dateStr, slot.time)}
                  className="p-2 border-r border-gray-200 last:border-r-0 min-h-[60px] cursor-pointer hover:bg-blue-50 transition-colors relative"
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="absolute inset-1 rounded p-2 text-xs cursor-pointer hover:opacity-80 transition-opacity border-l-4"
                      style={{ backgroundColor: event.color + '15', borderLeftColor: event.color }}
                      title={event.title}
                    >
                      <div className="font-medium truncate text-gray-900">{event.title}</div>
                      <div className="text-gray-600 truncate text-xs">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
