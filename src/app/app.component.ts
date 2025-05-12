import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ImportService } from './services/import/import.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicTemplateComponent } from './components/dynamic-template/dynamic-template.component';
import * as XLSX from 'xlsx';
import { MapTemplateComponent } from './components/map-template/map-template.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, AgGridAngular,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  importService = inject(ImportService);
  isLinear = false;
  title = 'import-ang';
  // excelData: any[] = [];

  rowData = [

  ];

  // Column Definitions: Defines the columns to be displayed.
  colDefs = signal<ColDef[]>([])


  constructor(public dialog: MatDialog) { }

  handleDownload() {
    this.dialog.open(DynamicTemplateComponent, {
      width: '50%'
    })
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.rowData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log('Excel data:', this.rowData);
      this.setColsFromExcel(this.rowData);
      this.dialog.open(MapTemplateComponent, {
        width: '50%',
        data: {
          colsFromExcel: this.colDefs().map((col: any) => col.field),
          // mapped: this.mapping
        }
      })
    };
    reader.readAsArrayBuffer(file);
  }

  setColsFromExcel(dataList: any[]) {
    let colSet = new Set();
    dataList.forEach((item: any) => {
      colSet = new Set([...colSet, ...Object.keys(item)]);
    });
    this.colDefs.set([...colSet].map((col: any) => ({ field: col })));
    console.log(this.colDefs);
  }

}
