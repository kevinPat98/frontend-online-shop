import { DatePickerLegalAgeModule } from '@shared/calendar/date-picker-legal-age/date-picker-legal-age.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveRoutingModule } from './active-routing.module';
import { ActiveComponent } from './active.component';


@NgModule({
  declarations: [ActiveComponent],
  imports: [
    CommonModule,
    ActiveRoutingModule,
    FormsModule,
    DatePickerLegalAgeModule
  ]
})
export class ActiveModule { }
