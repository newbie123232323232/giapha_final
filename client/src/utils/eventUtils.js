// Hàm lưu dữ liệu sự kiện vào localStorage
export const saveEventsData = (events) => {
  console.log('Đã lưu dữ liệu sự kiện:', events);
  localStorage.setItem('eventsData', JSON.stringify(events));
};

// Hàm lấy dữ liệu sự kiện từ localStorage
export const getEventsData = () => {
  const data = localStorage.getItem('eventsData');
  if (data) {
    return JSON.parse(data);
  }
  
  // Nếu chưa có dữ liệu, sử dụng dữ liệu mẫu từ file JSON
  return require('../data/events.json');
};

// Hàm lấy sự kiện theo ID
export const getEventById = (eventId) => {
  const data = getEventsData();
  return data.events.find(event => event.id === eventId);
};

// Hàm thêm sự kiện mới
export const addEvent = (eventData) => {
  const data = getEventsData();
  const newId = data.events.length > 0 
    ? Math.max(...data.events.map(e => e.id)) + 1 
    : 1;
  
  const newEvent = {
    ...eventData,
    id: newId,
    createdAt: new Date().toISOString()
  };
  
  const updatedEvents = {
    ...data,
    events: [...data.events, newEvent]
  };
  
  saveEventsData(updatedEvents);
  return newEvent;
};

// Hàm cập nhật sự kiện
export const updateEvent = (eventId, eventData) => {
  const data = getEventsData();
  const updatedEvents = {
    ...data,
    events: data.events.map(event => 
      event.id === eventId 
        ? { ...event, ...eventData, updatedAt: new Date().toISOString() } 
        : event
    )
  };
  
  saveEventsData(updatedEvents);
  return updatedEvents.events.find(e => e.id === eventId);
};

// Hàm xóa sự kiện
export const deleteEvent = (eventId) => {
  const data = getEventsData();
  const updatedEvents = {
    ...data,
    events: data.events.filter(event => event.id !== eventId)
  };
  
  saveEventsData(updatedEvents);
  return updatedEvents;
}; 