import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProjectsGridComponent } from './projects-grid.component';
import { GridComponent } from '../grid/grid.component';
import { IdRendererGridComponent } from '../grid/id-renderer-grid.component';
import { IdRouteRendererGridComponent } from '../grid/id-route-renderer-grid.component';
import { RouteRendererGridComponent } from '../grid/route-renderer-grid.component';
import { SearchToolPanelGridComponent } from '../grid/search-tool-panel-grid.component';
import { SortToolPanelGridComponent } from '../grid/sort-tool-panel-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

describe('ProjectsGridComponent', () => {
  let component: ProjectsGridComponent;
  let fixture: ComponentFixture<ProjectsGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectsGridComponent,
        GridComponent,
        IdRendererGridComponent,
        IdRouteRendererGridComponent,
        RouteRendererGridComponent,
        SearchToolPanelGridComponent,
        SortToolPanelGridComponent,
      ],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientModule,
        AgGridModule.withComponents([
          IdRendererGridComponent,
          IdRouteRendererGridComponent,
          RouteRendererGridComponent,
          SearchToolPanelGridComponent,
          SortToolPanelGridComponent,
        ]),
      ],
      providers: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientModule,
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
