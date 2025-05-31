export class Ticket {
    Cliente_Id?: string;
    Nombre_Cliente?: string;
    Factura_Id?: number;
    Fecha_Emision?: Date;
    Fecha_Vencimiento?: Date;
    Moneda?: string;
    Descripcion_Moneda?: string;
    Valor_Factura?: number;
    Tasa_Cambio_Emision?: number;
    Estado_Facturacion?: string;
    Descripcion_Estado_Facturacion?: string;
    Valor_Pagado?: number;
    Fecha_Pago?: Date;
    Tasa_Cambio_Pago?: number;
    Estado_Rec?: string;
}
