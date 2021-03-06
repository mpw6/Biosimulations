import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { ModelService } from '../../Services/Resources/model.service';
import { UtilsService } from '../../Services/utils.service';
import { Format } from '../../Models/format';
import { Model } from '../../Models/model';
import { User } from '../../Models/user';
import { UserService } from '../../Services/user.service';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Person } from '../../Models/person';

@Component({
  selector: 'app-models-grid',
  templateUrl: './models-grid.component.html',
  styleUrls: ['./models-grid.component.sass'],
})
export class ModelsGridComponent implements OnInit {
  columnDefs;
  rowData;

  private _owner: string;
  private userSer: UserService;
  @Input()
  set owner(value: string) {
    this._owner = value;
    this.rowData = this.modelService.list();
  }

  @Output() ready = new EventEmitter();

  private _selectable: string = null;

  @Input()
  set selectable(value: string) {
    this._selectable = value;
    if (this.columnDefs) {
      if (value) {
        this.columnDefs[0]['cellRenderer'] = 'idRenderer';
      } else {
        this.columnDefs[0]['cellRenderer'] = 'idRouteRenderer';
      }
    }
  }
  get selectable(): string {
    return this._selectable;
  }

  @Output() selectRow = new EventEmitter();

  @Input() inTab = false;

  @ViewChild('grid', { static: true }) grid;

  constructor(
    private modelService: ModelService,
    private userService: UserService,
  ) {
    this.userSer = userService;
  }

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'id',
        cellRenderer: this._selectable ? 'idRenderer' : 'idRouteRenderer',
        minWidth: 52,
        width: 60,
        maxWidth: 70,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Name',
        field: 'name',
        minWidth: 150,
      },

      {
        headerName: 'Taxon',
        field: 'taxon.name',
        valueGetter: taxonGetter,
        filterValueGetter: taxonGetter,
        filter: 'agSetColumnFilter',
        minWidth: 150,
      },
      {
        headerName: 'Tags',
        field: 'tags',
        filter: 'agSetColumnFilter',
        valueGetter: tagsGetter,
        filterValueGetter: tagsGetter,
        valueFormatter: 'value.join(", ")',
        minWidth: 150,
      },

      {
        headerName: 'Framework',
        field: 'framework.name',
        filter: 'agSetColumnFilter',
        minWidth: 125,
      },
      {
        headerName: 'Format',
        field: 'format',
        valueGetter: formatGetter,
        filter: 'agSetColumnFilter',
        minWidth: 125,
        hide: true,
      },

      {
        headerName: 'Authors',
        field: 'refs',
        valueGetter: authorGetter,
        filterValueGetter: authorGetter,
        valueFormatter: authorFormatter,
        minWidth: 150,
      },
      {
        headerName: 'Owner',
        field: 'owner',
        valueGetter: ownerGetter,
        minWidth: 150,
        hide: true,
      },

      {
        headerName: 'Access',
        field: 'access',
        filter: 'agSetColumnFilter',
        valueFormatter: capitalizeFormatter,
        minWidth: 75,
        hide: true,
      },
      {
        headerName: 'License',
        field: 'license',
        filter: 'agSetColumnFilter',
        minWidth: 75,
        hide: true,
      },

      {
        headerName: 'Created',
        field: 'created',
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        minWidth: 100,
        hide: true,
      },
      {
        headerName: 'Updated',
        field: 'updated',
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        minWidth: 100,
        hide: true,
      },
    ];
    this.rowData = this.modelService.list();
  }

  onReady(event): void {
    this.ready.emit();
  }

  unselectAllRows(): void {
    this.grid.unselectAllRows();
  }

  setRowSelection(rowDatum: object, selection: boolean): void {
    this.grid.setRowSelection(rowDatum, selection);
  }

  onSelectRow(event) {
    this.selectRow.emit(event);
  }
}

function taxonGetter(params): string {
  const model: Model = params.data;
  if (model.taxon.getShortName) {
    return params.data.taxon.getShortName();
  } else {
    return 'none';
  }
}
function tagsGetter(params): string[] {
  return params.data.tags;
}

function ownerGetter(params): string {
  const owner = params.data.owner;
  return owner.getFullName();
}

function formatGetter(params): string {
  const format: Format = params.data.format;
  return format.getFullName();
}

function capitalizeFormatter(params): string {
  const value: string = params.value;
  if (value) {
    return value.substring(0, 1).toUpperCase() + value.substring(1);
  } else {
    return '';
  }
}
// TODO Make this async capable
function authorGetter(params): string[] {
  const model: Model = params.data;
  const names: string[] = [];
  model
    .getAuthors()
    .forEach((author: Person) => names.push(author.getFullName()));
  return names;
}

function authorFormatter(params) {
  const value = params.value;
  return UtilsService.joinAuthorNames(value);
}

function dateFormatter(params): string {
  const date: Date = params.value;
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
}
