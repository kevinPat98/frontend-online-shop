import { basicAlert } from '@shared/alerts/toasts';
import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColums } from '@core/interfaces/table-columns.interface';
import { GENRE_LIST_QUERY } from '@graphql/operations/query/genre';
import { formBasicDialog, optionsWithDetails } from '@shared/alerts/alerts';
import { DocumentNode } from 'graphql';
import { GenresService } from './genres.service';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  query: DocumentNode = GENRE_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>;
  constructor(private service: GenresService) {}
  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'genres',
      definitionKey: 'genres',
    };
    this.include = false;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Nombre del género',
      },
      {
        property: 'slug',
        label: 'Slug',
      },
    ];
  }

  async takeAction($event) {
    // Información para las acciones
    const action = $event[0];
    const genre = $event[1];
    // Valor por defecto
    const defaultValue =
      genre.name !== undefined && genre.name !== '' ? genre.name : '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    // Teniendo en cuenta el caso, ejecutar una acción
    switch (action) {
      case 'add':
        // Añadir el item
        this.addForm(html);
        break;
      case 'edit':
        this.updateForm(html, genre);
        break;
      case 'info':
        const result = await optionsWithDetails(
          'Datalles',
          `${genre.name} (${genre.slug})`,
          350,
          '<i class="fas fa-pencil-alt"></i> Editar', // true
          '<i class="fas fa-lock"></i> Bloquear'
        ); // false
        if (result) {
          this.updateForm(html, genre);
        } else if (result === false) {
          this.blockForm(genre);
        }
        break;
      case 'block':
        this.blockForm(genre);
        break;
      default:
        break;
    }
  }
  private async addForm(html: string) {
    const result = await formBasicDialog('Añadir Género', html, 'name');
    this.addGenre(result);
  }
  private addGenre(result) {
    if (result.value) {
      this.service.add(result.value).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }
  private async updateForm(html: string, genre: any) {
    const result = await formBasicDialog('Modificar Género', html, 'name');
    console.log(result);
    this.updateGenre(genre.id, result);
  }
  private updateGenre(id: string, result) {
    console.log(id, result.value);
    if (result.value) {
      this.service.update(id, result.value).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }
  private blockGenre(id: string) {
    this.service.block(id).subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }
  private async blockForm(genre: any) {
    const result = await optionsWithDetails(
      '¿Seguro que quiere bloquear?',
      `Si bloquea el item seleccionado, no se mostrará en la lista`,
      430,
      'No bloquear',
      'Si Bloquear'
    );
    if (result === false) {
      // Si el resultado es falso se quiere bloquear
      this.blockGenre(genre.id);
    }
  }
}
