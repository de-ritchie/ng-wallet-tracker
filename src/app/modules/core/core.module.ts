import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreComponent } from "./core.component";

import { MatCoreModule } from "../../shared/modules/material/mat-core.module";
import { CoreRouter } from "./core.router";
import { DataComponent } from "./data/data.component";
import { WalletModalComponent } from "./data/wallet-modal/wallet-modal.component";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MAT_DATE_LOCALE } from "@angular/material/core";

@NgModule({
  declarations: [CoreComponent, DataComponent, WalletModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCoreModule,
    CoreRouter
  ],
  exports: [],
  entryComponents: [WalletModalComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ]
})
export class CoreModule {}
