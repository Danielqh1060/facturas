import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../../services/ticket';
import { Ticket } from '../../../models/ticket.model';
import { CustomerService } from '../../../services/customer';
import { Customer } from '../../../models/customer.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-list',
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [TicketService],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  clientes: Customer[] = [];
  filtroTexto: string = '';
  filtroEstado: string = '';
  filtroCliente: string = '';
  loading: boolean = true;

  constructor(
    private service: TicketService,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarClientes();
    this.list();
  }

  cargarClientes() {
    this.customerService.getCustomers({}).subscribe({
      next: (data) => {
        this.clientes = data.Lista_Clientes.map((item: any) => ({
          id: +item.Cliente_Id,
          nombre: item.Nombre_Cliente,
          nit: item.Nit,
          sectorId: +item.Sector_Id,
          descripcionSector: item.Descripcion_Sector,
          paginaWeb: item.Pagina_Web,
          emailFactura: item.Email_Fact_Electronica,
          asesorId: item.Asesor_Id_EasyNet_Responsable,
          nombreAsesor: item.Nombre_Asesor,
          estado: item.Estado_Rec
        } as Customer));
      }
    });
  }

  list() {
    this.service.list({ Cliente_Id: "" }).subscribe({
      next: (data) => {
        this.tickets = data.Lista_Facturas || [];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las facturas'
        });
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    const texto = this.filtroTexto.trim().toLowerCase();
    this.filteredTickets = this.tickets.filter(ticket => {
      const coincideTexto =
        !texto ||
        (ticket.Factura_Id && ticket.Factura_Id.toString().toLowerCase().includes(texto)) ||
        (ticket.Nombre_Cliente && ticket.Nombre_Cliente.toLowerCase().includes(texto));
      const coincideEstado =
        !this.filtroEstado || ticket.Estado_Rec === this.filtroEstado;
      const coincideCliente =
        !this.filtroCliente ||
        (ticket.Cliente_Id && ticket.Cliente_Id.toString() === this.filtroCliente.toString());
      return coincideTexto && coincideEstado && coincideCliente;
    });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar esta factura!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'La factura ha sido eliminada.',
              'success'
            );
            this.list();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la factura'
            });
          }
        });
      }
    });
  }

  abrirCrearFactura() {
    this.router.navigate(['/ticket/manage'], { queryParams: { modo: 'crear' } });
  }

  abrirDetalle(ticket: any) {
    this.router.navigate(['/ticket/manage'], {
      queryParams: { modo: 'detalle' },
      state: { factura: ticket }
    });
  }

  abrirEditar(ticket: any) {
    this.router.navigate(['/ticket/manage'], {
      queryParams: { modo: 'editar' },
      state: { factura: ticket }
    });
  }
}