require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, configureSqlite } = require('./config/database');
require('./models');
require('./jobs/depositExpiryJob');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes');
const contractRoutes = require('./routes/contractRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 3001;

const ensureSchema = async () => {
  const columns = await sequelize.getQueryInterface().describeTable('lich_hen').catch(() => ({}));
  if (!columns.loai_lich_hen) {
    await sequelize.getQueryInterface().addColumn('lich_hen', 'loai_lich_hen', {
      type: require('sequelize').DataTypes.STRING,
      allowNull: false,
      defaultValue: 'property_viewing'
    });
  }
};

configureSqlite().then(() => sequelize.sync({ force: false })).then(ensureSchema).then(() => {
  console.log('--- Database connected ---');
  app.listen(PORT, () => {
    console.log(`--- Server running on port ${PORT} ---`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});
