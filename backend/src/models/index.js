const { sequelize } = require('../config/database');
const Property = require('./Property');
const DepositContract = require('./DepositContract');
const RentalContract = require('./RentalContract');
const User = require('./User');
const Appointment = require('./Appointment');
const Commission = require('./Commission');
const Interaction = require('./Interaction');
const Refund = require('./Refund');
const ContractDocument = require('./ContractDocument');

Property.hasOne(DepositContract, { foreignKey: 'nha_cho_thue_id' });
DepositContract.belongsTo(Property, { foreignKey: 'nha_cho_thue_id' });

User.hasMany(Property, { foreignKey: 'chu_nha_id' });
Property.belongsTo(User, { foreignKey: 'chu_nha_id', as: 'Landlord' });

User.hasMany(DepositContract, { foreignKey: 'nhan_vien_id' });
DepositContract.belongsTo(User, { foreignKey: 'nhan_vien_id', as: 'Broker' });

Property.hasMany(Appointment, { foreignKey: 'nha_cho_thue_id' });
Appointment.belongsTo(Property, { foreignKey: 'nha_cho_thue_id' });

User.hasMany(Appointment, { foreignKey: 'khach_hang_id', as: 'CustomerAppointments' });
Appointment.belongsTo(User, { foreignKey: 'khach_hang_id' });

User.hasMany(Appointment, { foreignKey: 'nhan_vien_id', as: 'EmployeeAppointments' });
Appointment.belongsTo(User, { foreignKey: 'nhan_vien_id', as: 'Broker' });

User.hasMany(RentalContract, { foreignKey: 'khach_hang_id', as: 'CustomerContracts' });
RentalContract.belongsTo(User, { foreignKey: 'khach_hang_id', as: 'Customer' });
User.hasMany(RentalContract, { foreignKey: 'nhan_vien_id', as: 'EmployeeContracts' });
RentalContract.belongsTo(User, { foreignKey: 'nhan_vien_id', as: 'Broker' });
Property.hasMany(RentalContract, { foreignKey: 'nha_cho_thue_id' });
RentalContract.belongsTo(Property, { foreignKey: 'nha_cho_thue_id' });

User.hasMany(Commission, { foreignKey: 'nhan_vien_id' });
Commission.belongsTo(User, { foreignKey: 'nhan_vien_id', as: 'Broker' });
RentalContract.hasMany(Commission, { foreignKey: 'hop_dong_thue_id' });
Commission.belongsTo(RentalContract, { foreignKey: 'hop_dong_thue_id' });

DepositContract.hasMany(Refund, { foreignKey: 'hop_dong_ky_gui_id' });
Refund.belongsTo(DepositContract, { foreignKey: 'hop_dong_ky_gui_id' });

User.hasMany(Interaction, { foreignKey: 'nhan_vien_id', as: 'EmployeeInteractions' });
Interaction.belongsTo(User, { foreignKey: 'nhan_vien_id', as: 'Broker' });
User.hasMany(Interaction, { foreignKey: 'khach_hang_id', as: 'CustomerInteractions' });
Interaction.belongsTo(User, { foreignKey: 'khach_hang_id', as: 'Customer' });
Property.hasMany(Interaction, { foreignKey: 'nha_cho_thue_id' });
Interaction.belongsTo(Property, { foreignKey: 'nha_cho_thue_id' });

User.hasMany(ContractDocument, { foreignKey: 'nguoi_tai_len_id' });
ContractDocument.belongsTo(User, { foreignKey: 'nguoi_tai_len_id', as: 'Uploader' });
RentalContract.hasMany(ContractDocument, {
  foreignKey: 'hop_dong_id',
  constraints: false,
  scope: { loai_hop_dong: 'rental' }
});
ContractDocument.belongsTo(RentalContract, {
  foreignKey: 'hop_dong_id',
  constraints: false
});
DepositContract.hasMany(ContractDocument, {
  foreignKey: 'hop_dong_id',
  constraints: false,
  scope: { loai_hop_dong: 'deposit' }
});
ContractDocument.belongsTo(DepositContract, {
  foreignKey: 'hop_dong_id',
  constraints: false
});

module.exports = {
  sequelize,
  User,
  Property,
  DepositContract,
  RentalContract,
  Appointment,
  Commission,
  Interaction,
  Refund,
  ContractDocument
};
