// BACKEND/db/migrations/create-roles-table.ts
/**
 * Este archivo debe ejecutarse para crear la tabla de roles
 * y migrar los roles existentes de la tabla usuarios
 */
import { Sequelize, QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Crear la tabla de roles
  await queryInterface.createTable('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'activo'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  // Insertar los roles básicos del sistema
  await queryInterface.bulkInsert('roles', [
    {
      nombre: 'Administrador',
      codigo: 'ADMIN_ROLE',
      descripcion: 'Acceso completo al sistema',
      estado: 'activo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: 'Usuario',
      codigo: 'USER_ROLE',
      descripcion: 'Acceso básico para pacientes',
      estado: 'activo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: 'Médico',
      codigo: 'MEDICO_ROLE',
      descripcion: 'Acceso para profesionales médicos',
      estado: 'activo',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('roles');
}