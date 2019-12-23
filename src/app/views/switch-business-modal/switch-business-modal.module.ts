import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SwitchBusinessModalComponent } from './switch-business-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SwitchBusinessModalComponent],
  entryComponents: [SwitchBusinessModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [SwitchBusinessModalComponent]
})
export class SwitchBusinessModalModule { }
