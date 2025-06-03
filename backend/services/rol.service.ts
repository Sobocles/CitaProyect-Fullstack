// services/rol.service.ts
import Rol from '../models/rol';
import { UserRole } from '../types/enums';
import { getMenuFrontEnd } from '../helpers/menu-frontend';

/**
 * Servicio para la gestión de roles en el sistema
 */
export default class RolService {
  private static _instance: RolService;

  public static get instance() {
    return this._instance || (this._instance = new RolService());
  }

  private constructor() {}

  /**
   * Verifica si un rol existe en la base de datos
   * @param codigo Código del rol a verificar
   * @returns true si existe, false si no
   */
  public async rolExiste(codigo: string): Promise<boolean> {
    const rol = await Rol.findOne({ where: { codigo, estado: 'activo' } });
    return !!rol;
  }

  /**
   * Obtiene todos los roles activos
   * @returns Lista de roles activos
   */
  public async obtenerRoles() {
    return await Rol.findAll({ where: { estado: 'activo' } });
  }

  /**
   * Obtiene un rol por su código
   * @param codigo Código del rol
   * @returns Rol encontrado o null
   */
  public async obtenerRolPorCodigo(codigo: string) {
    return await Rol.findOne({ where: { codigo, estado: 'activo' } });
  }

  /**
   * Verifica si un rol es válido según los roles del sistema
   * @param rolCodigo Código del rol a validar
   * @returns true si es válido, false si no
   */
  public async esRolValido(rolCodigo: string): Promise<boolean> {
    // Si es uno de los roles predefinidos, es válido
    if (Object.values(UserRole).includes(rolCodigo as UserRole)) {
      return true;
    }
    
    // Si no, verificar en la base de datos
    return await this.rolExiste(rolCodigo);
  }

  /**
   * Obtiene los roles que puede asignar un usuario según su propio rol
   * @param rolActual Rol actual del usuario
   * @returns Array de códigos de roles que puede asignar
   */
  public async obtenerRolesPermitidos(rolActual: string): Promise<string[]> {
    // Por defecto, nadie puede asignar roles
    let rolesPermitidos: string[] = [];
    
    switch (rolActual) {
      case UserRole.ADMIN:
        // Un administrador puede asignar cualquier rol
        const todosRoles = await this.obtenerRoles();
        rolesPermitidos = todosRoles.map(rol => rol.codigo);
        break;
      
      case UserRole.MEDICO:
        // Un médico solo puede asignar rol de paciente
        rolesPermitidos = [UserRole.USER];
        break;
      
      // Otros roles no pueden asignar roles
      default:
        break;
    }
    
    return rolesPermitidos;
  }

  /**
   * Obtiene el menú correspondiente al rol del usuario
   * @param rol Rol del usuario
   * @returns Menú disponible para el rol
   */
  public getMenuByRol(rol: string) {
    return getMenuFrontEnd(rol);
  }
}