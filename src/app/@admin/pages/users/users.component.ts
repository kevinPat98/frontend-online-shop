import { DocumentNode } from 'graphql';
import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { USERS_LIST_QUERY } from '@graphql/operations/query/user';
import { ITableColums } from '@core/interfaces/table-columns.interface';
import { optionsWithDetails, userformBasicDialog } from '@shared/alerts/alerts';
import { UsersAdminService } from './users-admin.service';
import { IRegisterForm } from '@core/interfaces/register.interface';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  query: DocumentNode = USERS_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>;
  constructor(private service: UsersAdminService) {}
  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'users',
      definitionKey: 'users'
    };
    this.include = true;
    this.columns = [
      {
        property: 'id',
        label: '#'
      },
      {
        property: 'name',
        label: 'Nombre'
      },
      {
        property: 'lastname',
        label: 'Apellidos'
      },
      {
        property: 'email',
        label: 'Correo Electrónico'
      },
      {
        property: 'role',
        label: 'Permisos'
      }
    ];
  }

  private initializeForm(user: any) {
    const defaultName =
      user.name !== undefined && user.name !== '' ? user.name : '';
    const defaultLastname =
      user.lastname !== undefined && user.lastname !== '' ? user.lastname : '';
    const defaultEmailemail =
      user.email !== undefined && user.email !== '' ? user.email : '';
    const roles = new Array(2);
    roles[0] =  user.role !== undefined && user.role === 'ADMIN' ? 'selected': '';
    roles[1] =  user.role !== undefined && user.role === 'CLIENT' ? 'selected': '';
    return `
      <input id="name" value="${defaultName}" class="swal2-input" placeholder="Nombre" required>
      <input id="lastname" value="${defaultLastname}" class="swal2-input" placeholder="Apellido" required>
      <input id="email" value="${defaultEmailemail}" class="swal2-input" placeholder="Correo Electrónico" required>
      <select id="role" class="swal2-input">
        <option value="ADMIN" ${roles[0]}>Administrador</option>
        <option value="CLIENT" ${roles[1]}>Cliente</option>
      </select>
    `;
  }
  async takeAction($event) {
    // Información para las acciones
    const action = $event[0];
    const user = $event[1];
    // Valor por defecto
    const html = this.initializeForm(user);
    switch (action) {
      case 'add':
        // Añadir el item
        this.addForm(html);
        break;
      case 'edit':
        this.updateForm(html, user);
        break;
      case 'info':
        const result = await optionsWithDetails(
          'Datalles',
          `${user.name} ${user.lastname}<br/>
          <i class="fas fa-envelope"></i>&nbsp;&nbsp;${user.email}`,
          350,
          '<i class="fas fa-pencil-alt"></i> Editar', // true
          '<i class="fas fa-lock"></i> Bloquear'
        ); // false
        if (result) {
          this.updateForm(html, user);
        } else if (result === false) {
          this.blockForm(user);
        }
        break;
      case 'block':
        this.blockForm(user);
        break;
      default:
        break;
    }
  }

  private async addForm(html: string) {
    const result = await userformBasicDialog('Añadir Usuario', html);
    this.addUser(result);
  }

  private addUser(result){
    if (result.value){
      const user: IRegisterForm = result.value;
      user.password = '1234';
      user.active = false;
      this.service.register(user).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private async updateForm(html:string, user: any){
    const result = await userformBasicDialog('Modificar Usuario', html);
    this.updateUser(result, user.id);
  }

  private updateUser(result, id: string){
    if (result.value){
      const user = result.value;
      user.id = id;
      this.service.update(result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }
  private async blockForm(user: any) {
    const result = await optionsWithDetails(
      '¿Seguro que quiere bloquear?',
      `Si bloquea el usuario seleccionado, no se mostrará en la lista`,
      430,
      'No bloquear',
      'Si Bloquear'
    );
    if (result === false) {
      // Si el resultado es falso se quiere bloquear
      this.blockUser(user.id);
    }
  }
  private blockUser(id: string) {
    this.service.block(id).subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }
}
