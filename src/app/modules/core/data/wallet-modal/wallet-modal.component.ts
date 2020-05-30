import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RecordType, States, IModalData, IRecord } from "../data.component";
import { SharedService } from "../../../../shared/services/shared.service";

interface record {
  value: string;
  viewValue: RecordType;
}

@Component({
  selector: "app-wallet-modal",
  templateUrl: "./wallet-modal.component.html",
  styleUrls: ["./wallet-modal.component.css"]
})
export class WalletModalComponent {
  minDate: Date;
  maxDate: Date;
  recordTypes: Array<record> = [];
  record: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private modalData: DialogData<IModalData>,
    private dialogRef: MatDialogRef<WalletModalComponent>,
    private sharedService: SharedService
  ) {
    const date = new Date();
    this.minDate = new Date(date.getFullYear() - 10, 0, 1);
    this.maxDate = date;
    let record: IRecord = this.modalData.record;
    console.log("recordddddd", record);
    this.record = new FormGroup({
      desc: new FormControl(record.desc, [
        Validators.required,
        Validators.minLength(5)
      ]),
      amount: new FormControl(record.amount, [
        Validators.required,
        Validators.min(1),
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(10)
      ]),
      type: new FormControl(Object.keys(RecordType)[0], [Validators.required]),
      date: new FormControl(new Date(record.date), [Validators.required])
    });
    for (let i in RecordType)
      this.recordTypes.push({ value: i, viewValue: RecordType[i] });
  }

  onCancel(): void {
    this.dialogRef.close({
      state: States.cancel
    });
  }

  onSubmit(): void {
    console.log(this.record.value);
    console.log(this.record.get("date"));
    let { date, type, desc, amount } = this.record.value;
    let record = {
      date: new Date(date).toLocaleDateString(),
      desc,
      amount,
      type
    };
    if (this.modalData.state === States.modify) {
      let id = this.modalData.record.id;
      record["id"] = id;
      this.sharedService
        .updateRecord(id, record)
        .subscribe((response: IRecord) => {
          response.date = new Date(response.date).toLocaleDateString();
          response.type = RecordType[response.type];
          this.dialogRef.close({
            state: this.modalData.state,
            value: response
          });
        });
      return;
    }
    this.sharedService.addRecord(record).subscribe((response: IRecord) => {
      response.date = new Date(response.date).toLocaleDateString();
      response.type = RecordType[response.type];
      this.dialogRef.close({
        state: this.modalData.state,
        value: response
      });
    });
  }
}
