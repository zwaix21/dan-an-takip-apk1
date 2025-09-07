import React from 'react';
import { CalendarEvent, TimeSlot } from '../../types';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  timeSlots: TimeSlot[];
  onTimeSlotClick: (date: string, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function DayView({ 
  date, 
  events, 
  timeSlots, 
  onTimeSlotClick, 
  onEventClick 
}: DayViewProps) {
  const dateStr = date.toISOString().split('T')[0];
  
  const getEventsForTime = (time: string) => {
    return events.filter(event => 
      event.date === dateStr && event.startTime === time
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Gün başlığı */}
      <div className={`p-6 border-b border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
        <h2 className={`text-xl font-semibold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
          {formatDate(date)}
        </h2>
        {isToday && (
          <p className="text-blue-600 text-sm mt-1">Bugün</p>
        )}
      </div>

      {/* Zaman slotları */}
      <div className="max-h-[700px] overflow-y-auto">
        {timeSlots.map((slot) => {
          const slotEvents = getEventsForTime(slot.time);
          
          return (
            <div 
              key={slot.time} 
              className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="w-20 p-4 text-center border-r border-gray-200 bg-gray-50">
                <span className="text-sm font-medium text-gray-600">{slot.time}</span>
              </div>
              
              <div
                onClick={() => onTimeSlotClick(dateStr, slot.time)}
                className="flex-1 p-4 min-h-[80px] cursor-pointer relative"
              >
                {slotEvents.length === 0 ? (
                  <div className="text-gray-400 text-sm">Randevu eklemek için tıklayın</div>
                ) : (
                  <div className="space-y-2">
                    {slotEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity border-l-4"
                        style={{ 
                          backgroundColor: event.color + '15', 
                          borderLeftColor: event.color 
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <span className="text-sm text-gray-600">
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">
                              Katılımcılar: {event.attendees.join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center mt-2">
                          <span 
                            className="inline-block w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: event.color }}
                          ></span>
                          <span className="text-xs text-gray-500">
                            {event.type === 'appointment' ? 'Randevu' : 
                             event.type === 'meeting' ? 'Toplantı' : 'Mola'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}