import { Component } from '@angular/core';
import { TicketService } from '../../../services/ticket';
import { CustomerService } from '../../../services/customer';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './manage.html',
  styleUrl: './manage.css'
})
export class Manage {
  factura = {
    Tipo_Novedad: 'NUEVO',
    Cliente_Id: '',
    Factura_Id: null,
    Fecha_Emision: '',
    Fecha_Vencimiento: '',
    Moneda: '',
    Descripcion_Moneda: '',
    Valor_Factura: null,
    Tasa_Cambio_Emision: 1,
    Estado_facturacion: '',
    Valor_Pagado: 0,
    Fecha_Pago: '',
    Tasa_Cambio_Pago: 1,
    Usuario_Responsable: '',
    Estado_Rec: 'A'
  };

  clientes: any[] = [];
  modo: 'crear' | 'editar' | 'detalle' = 'crear';

  constructor(
    private service: TicketService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cargarClientes();
  }

  cargarClientes() {
    this.customerService.getCustomers({}).subscribe({
      next: (data) => {
        this.clientes = data.Lista_Clientes.map((item: any) => ({
          id: +item.Cliente_Id,
          nombre: item.Nombre_Cliente
        }));
      }
    });
  }

  crearFactura() {
    if (!this.factura.Factura_Id || !this.factura.Cliente_Id || !this.factura.Fecha_Emision || !this.factura.Fecha_Vencimiento || !this.factura.Valor_Factura || !this.factura.Moneda) {
      Swal.fire('Campos obligatorios', 'Por favor complete todos los campos obligatorios.', 'warning');
      return;
    }
    this.service.create(this.factura).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Factura creada correctamente', 'success');
        this.router.navigate(['']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear la factura', 'error');
      }
    });
  }

  actualizarFactura() {
    if (!this.factura.Factura_Id || !this.factura.Cliente_Id || !this.factura.Fecha_Emision || !this.factura.Fecha_Vencimiento || !this.factura.Valor_Factura || !this.factura.Moneda) {
      Swal.fire('Campos obligatorios', 'Por favor complete todos los campos obligatorios.', 'warning');
      return;
    }
    const facturaEditada = {
      ...this.factura,
      Tipo_Novedad: 'ACTUALIZAR'
    };
    this.service.create(facturaEditada).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Factura actualizada correctamente', 'success');
        this.router.navigate(['']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar la factura', 'error');
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.modo = params['modo'] || 'crear';

      const navigation = this.router.getCurrentNavigation();
      const facturaState = navigation?.extras?.state?.['factura'];

      if ((this.modo === 'editar' || this.modo === 'detalle') && facturaState) {
        this.cargarFactura(facturaState, this.modo as any);
      } else if ((this.modo === 'editar' || this.modo === 'detalle') && params['id']) {
        this.service.getById(params['id']).subscribe({
          next: (resp) => {
            this.cargarFactura(resp.Factura || resp, this.modo as any);
          }
        });
      }
    });
    this.cargarClientes();
  }

  cargarFactura(factura: any, modo: 'editar' | 'detalle') {
    this.factura = {
      ...this.factura,
      ...factura
    };
    this.modo = modo;
  }

  getNombreCliente(clienteId: number | string): string {
    const cliente = this.clientes.find(c => c.id == clienteId);
    return cliente ? cliente.nombre : '';
  }

  getNombreMoneda(moneda: string): string {
    switch (moneda) {
      case '1': return 'COP - Peso Colombiano';
      case '2': return 'USD - Dólar';
      default: return moneda;
    }
  }

  cancelar() {
    this.router.navigate(['']);
  }
}