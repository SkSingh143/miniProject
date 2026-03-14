const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { PORT } = require('./src/config/env');
const { errorHandler } = require('./src/middlewares/errorMiddleware');

// Route Imports
const authRoutes = require('./src/routes/auth.routes');
const adminRoutes = require('./src/routes/admin.routes');
const clinicRoutes = require('./src/routes/clinic.routes');
const doctorRoutes = require('./src/routes/doctor.routes');
const appointmentRoutes = require('./src/routes/appointment.routes');

const patientRoutes = require('./src/routes/patient.routes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS for frontend

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use('/api/patient', patientRoutes);

// Error Handler (Must be last middleware)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});