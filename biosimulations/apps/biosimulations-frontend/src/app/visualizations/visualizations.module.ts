import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from '../Shared/shared.module';

import { VisualizationsRoutingModule } from './visualizations-routing.module';

import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';

import { NgxDnDModule } from '@swimlane/ngx-dnd';
@NgModule({
  declarations: [BrowseComponent, EditComponent, ViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MaterialModule,
    SharedModule,
    VisualizationsRoutingModule,
    NgxDnDModule.forRoot(),
  ],
  exports: [],
})
export class VisualizationsModule {}
