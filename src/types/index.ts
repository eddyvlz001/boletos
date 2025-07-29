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

export interface Evento {
  titulo: string;
  tipo: TipoEvento;
  fecha: Date;
  ubicacion: string;
  horaInicio: string;
  horaFin: string;
  numeroInvitados: number;
  detallesEspecificos: DetalleEspecifico[];
}

export interface Contrato {
  id: string;
  numeroContrato: string;
  fecha: Date;
  cliente: Cliente;
  evento: Evento;
  servicios: Servicio[];
  items: Item[];
  total: number;
  anticipo: number;
  saldo: number;
  formaPago: FormaPago;
  estado: 'pendiente' | 'completado' | 'cancelado';
  notas: string;
}

export interface ItemOrden {
  id: string;
  tipo: string;
  talla?: string;
  color?: string;
  cantidad: number;
  tipoImpresion?: string;
  impresionFrente?: boolean;
  impresionAtras?: boolean;
  descripcion?: string;
  precio?: number;
}

export type FormaPago = 'efectivo' | 'cheque' | 'credito' | 'debito';

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

export interface Boleto {
  id: string;
  numero: number;
  nombreComprador?: string;
  telefonoComprador?: string;
  direccionComprador?: string;
  fechaVenta?: Date;
  estado: 'disponible' | 'vendido' | 'reservado';
}

export interface Rifa {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaSorteo: Date;
  precioBoleto: number;
  numeroInicio: number;
  numeroFin: number;
  imagen?: string;
  estado: 'activa' | 'finalizada' | 'cancelada';
  boletos: Boleto[];
}