export interface Personal {
    id: string;
    nombre: string;
    rol: string;
}
export interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    tipo: 'hora' | 'cantidad' | 'fijo';
    duracion?: number;
    personal?: Personal[];
    items?: Item[];
}
export interface Item {
    id: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    servicioId?: string;
}
export type TipoEvento = 'boda' | 'quinceanos' | 'bautizo' | 'graduacion' | 'cumpleanos' | 'otro' | string;
export interface DetalleEspecifico {
    id: string;
    nombre: string;
    valor: string;
}
export interface Cliente {
    id?: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad?: string;
    codigoPostal?: string;
    createdAt?: Date;
}
export interface OrdenTrabajo {
    id: string;
    numeroOrden: string;
    fecha: Date;
    cliente: Cliente;
    items: ItemOrden[];
    detalles: Record<string, any>;
    especificaciones: string;
    fechaEntrega?: Date;
    prioridad: 'baja' | 'media' | 'alta' | 'urgente';
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'entregado';
    subtotal: number;
    impuesto: number;
    total: number;
    anticipo: number;
    saldo: number;
    formaPago: FormaPago;
    notas: string;
}
