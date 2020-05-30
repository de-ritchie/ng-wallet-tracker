import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef
} from "@angular/material/dialog";
import { WalletModalComponent } from "./wallet-modal/wallet-modal.component";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "../../../shared/services/shared.service";

export enum RecordType {
  "income" = "Income",
  "expense" = "Expense"
}

export interface IRecord {
  id?: string;
  desc: string;
  date: string;
  amount: number;
  type: RecordType;
}

export interface IModalData {
  state: States;
  title: string;
  record: IRecord;
}

export enum States {
  cancel = "CANCEL",
  add = "ADD",
  modify = "MODIFY"
}

let records: IRecord[] = [
  // {
  //   id: "CTN",
  //   desc: "Test1",
  //   date: new Date().toString(),
  //   amount: 5000,
  //   type: IRecordType.income
  // },
  // {
  //   id: "CTq",
  //   desc: "Test2",
  //   date: new Date().toString(),
  //   amount: 5000,
  //   type: IRecordType.expense
  // }
];

records.map(x => {
  x.date = new Date(x.date).toLocaleDateString();
  return x;
});

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.css"]
})
export class DataComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "date",
    "desc",
    "type",
    "amount",
    "edit",
    "delete"
  ];
  dataSource: MatTableDataSource<IRecord>;
  toBeAdded: IRecord[] = [];
  toBeModified: IRecord[] = [];
  toBeSaved: IRecord[] = [];

  constructor(
    private dialog: MatDialog,
    private detector: ChangeDetectorRef,
    private sharedService: SharedService
  ) {
    this.dataSource = new MatTableDataSource<IRecord>([]);
    this.dataSource.data = records;
  }

  ngOnInit() {
    this.getAllRecords();
  }

  onAdd() {
    let modalData: IModalData = {
      title: "Add a new record",
      state: States.add,
      record: {
        desc: "",
        type: RecordType.income,
        date: new Date().toLocaleDateString(),
        amount: 1
      }
    };
    const dialogRef: MatDialogRef<WalletModalComponent> = this.openDialog(
      modalData
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result.state === States.add) {
        console.log("The dialog was closed", result, this.dataSource);
        records.unshift(result.value);
        this.dataSource.data = records;
      }
    });
  }

  onEdit(index: number) {
    console.log(index, records[index]);
    let modalData: IModalData = {
      title: "Edit record",
      state: States.modify,
      record: records[index]
    };
    const dialogRef: MatDialogRef<WalletModalComponent> = this.openDialog(
      modalData
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result.state === States.modify) {
        console.log("The dialog was closed", result, this.dataSource);
        records[index] = result.value;
        this.dataSource.data = records;
      }
    });
  }

  onDelete(index: number) {
    console.log(index, records[index].id);
    this.sharedService.deleteRecord(records[index].id).subscribe(response => {
      console.log(response);
      if (response.status === 204) {
        records.splice(index, index + 1);
        this.dataSource.data = records;
      }
    });
  }

  openDialog(modalData: IModalData): MatDialogRef<WalletModalComponent> {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = modalData;

    return this.dialog.open(WalletModalComponent, dialogConfig);
  }

  getAllRecords() {
    this.sharedService.getRecords().subscribe((response: IRecord[]) => {
      response.map(x => {
        x.date = new Date(x.date).toLocaleDateString();
        x.type = RecordType[x.type];
        return x;
      });
      records = response;
      this.dataSource.data = records;
    });
  }
}
