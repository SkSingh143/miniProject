const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

// Check if a slot is in the past
const isSlotPast = (date, timeSlot) => {
  const slotDate = new Date(`${formatDate(date)}T${timeSlot}:00`);
  const now = new Date();
  return slotDate < now;
};

module.exports = { formatDate, isSlotPast };