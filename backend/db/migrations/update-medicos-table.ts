// db/migrations/update-medicos-table.ts
/**
 * Este archivo debe ejecutarse para actualizar la tabla de médicos
 * y migrar los roles existentes a la relación con la tabla roles
 */
import { Sequelize, QueryInterface, DataTypes, QueryTypes } from 'sequelize';
import { UserRole } from '../../types/enums';

interface RolRow {
  id: number;
  codigo: string;
}

export async function up(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
  try {
    // 1. Añadir la nueva columna rolId a la tabla medicos
    await queryInterface.addColumn('medicos', 'rolId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    });
    
    console.log('Columna rolId añadida a la tabla medicos');
    
    // 2. Actualizar la columna rolId basándose en los valores actuales de la columna rol
    // Primero, necesitamos obtener los ids de cada rol
    const rolesResult = await sequelize.query(
      `SELECT id, codigo FROM roles`, 
      { type: QueryTypes.SELECT }
    );
    
    const roles = rolesResult as RolRow[];
    console.log('Roles obtenidos:', roles);
    
    // Mapear los códigos de rol a sus ids
    const rolIdMap: Record<string, number> = {};
    roles.forEach(role => {
      rolIdMap[role.codigo] = role.id;
    });
    
    console.log('Mapa de roles:', rolIdMap);
    
    // ID predeterminado para médicos (asumiendo que MEDICO_ROLE tiene id 3)
    const medicoRolId = rolIdMap[UserRole.MEDICO] || 3;
    console.log('ID del rol MEDICO_ROLE:', medicoRolId);
    
    // Actualizar los médicos que tienen rol 'MEDICO_ROLE'
    await sequelize.query(`
      UPDATE medicos 
      SET rolId = ${medicoRolId}
      WHERE rol = 'MEDICO_ROLE' OR rol IS NULL
    `, { type: QueryTypes.UPDATE });
    
    console.log('Médicos actualizados con el rolId correcto');
    
    // 3. Hacer que la columna rolId sea NOT NULL
    await queryInterface.changeColumn('medicos', 'rolId', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    });
    
    console.log('Columna rolId actualizada a NOT NULL');
    
    // 4. Opcional: Eliminar la columna rol (sólo si estás seguro de que ya no se necesita)
    // await queryInterface.removeColumn('medicos', 'rol');
    // console.log('Columna rol eliminada de la tabla medicos');
    
    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error durante la migración:', error);
    throw error;
  }
}

export async function down(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
  try {
    // Si se eliminó la columna rol, volverla a añadir
    await queryInterface.addColumn('medicos', 'rol', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'MEDICO_ROLE'
    });
    
    console.log('Columna rol restaurada en la tabla medicos');
    
    // Restaurar los valores en la columna rol basándose en rolId
    const rolesResult = await sequelize.query(
      `SELECT id, codigo FROM roles`, 
      { type: QueryTypes.SELECT }
    );
    
    const roles = rolesResult as RolRow[];
    console.log('Roles obtenidos para restauración:', roles);
    
    // Para cada rol, actualizar los médicos correspondientes
    for (const role of roles) {
      await sequelize.query(`
        UPDATE medicos
        SET rol = '${role.codigo}'
        WHERE rolId = ${role.id}
      `, { type: QueryTypes.UPDATE });
      
      console.log(`Médicos con rolId ${role.id} actualizados a rol ${role.codigo}`);
    }
    
    // Eliminar la columna rolId
    await queryInterface.removeColumn('medicos', 'rolId');
    console.log('Columna rolId eliminada de la tabla medicos');
    
    console.log('Reversión de migración completada exitosamente');
  } catch (error) {
    console.error('Error durante la reversión de la migración:', error);
    throw error;
  }
}