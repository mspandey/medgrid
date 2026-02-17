// Simple Node.js/Socket.io Server Logic
const io = require('socket.io')(3000);

// Watch for hospital database changes
hospitalDB.on('change', (update) => {
  if (update.availableBeds === 0) {
    // Broadcast to all ambulances currently navigating to this hospital
    io.emit('hospitalFull', { 
      hospitalId: update.id, 
      message: "Divert: Facility at capacity." 
    });
  }
});