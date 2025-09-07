const [formData, setFormData] = useState({
  clientId: '',
  date: selectedDate || new Date().toISOString().split('T')[0],
  startTime: selectedTime || '09:00',
  endTime: '10:00',
  sessionType: 'Bireysel Terapi',
  cost: '500',
  status: 'scheduled' as const,
  notes: '',
  sessionNumber: 1
});

useEffect(() => {
  if (appointment) {
    setFormData({
      clientId: appointment.clientId,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      sessionType: appointment.sessionType,
      cost: appointment.cost.toString(),
      status: appointment.status,
      notes: appointment.notes,
      sessionNumber: appointment.sessionNumber
    });
  } else if (selectedTime) {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const endHour = (hours + 1) % 24; // 24 geçerse 0’a dön
    const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, endTime }));
  }
}, [appointment, selectedTime]);
