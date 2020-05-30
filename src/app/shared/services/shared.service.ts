import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IRecord } from "../../modules/core/data/data.component";
import { Observable } from "rxjs";

const URL: string = "https://ovr26.sse.codesandbox.io/api/";

@Injectable({
  providedIn: "root"
})
export class SharedService {
  constructor(private http: HttpClient) {
    console.log("Shared Service init");
  }

  addRecord(record: any): Observable<IRecord> {
    console.log(record);
    return this.http.post<any>(`${URL}record`, record);
  }

  updateRecord(recordId: string, record: IRecord): Observable<IRecord> {
    return this.http.put<IRecord>(`${URL}record/${recordId}`, record);
  }

  deleteRecord(recordId: string): Observable<any> {
    return this.http.delete(`${URL}record/${recordId}`, {
      observe: "response"
    });
  }

  getRecords(): Observable<IRecord[]> {
    return this.http.get<any>(`${URL}records`);
  }
}
