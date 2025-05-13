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
import { MatCheckboxModule } from '@angular/material/checkbox';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, AgGridAngular,
    MatCheckboxModule,
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

  rowData = signal<any[]>([]);

  colDefs = signal<ColDef[]>([])
  mapping = signal<{ [field: string]: string }>({});
  colsFromExcel = signal<string[]>([]);

  showErrors = signal(true);
  showValid = signal(true);

  get filteredRowData() {
    const data = this.rowData();
    if (this.showErrors() && this.showValid()) {
      return data;
    }
    const requiredFields = this.importService.fields.filter((f: any) => f.required).map((f: any) => this.mapping()?.[f.name]);
    return data.filter((row: any) => {
      const hasError = requiredFields.some((field: string) => !row[field] || row[field] === '');
      if (this.showErrors() && hasError) return true;
      if (this.showValid() && !hasError) return true;
      return false;
    });
  }

  toggleShowErrors(event: any) {
    this.showErrors.set(event.checked);
  }
  toggleShowValid(event: any) {
    this.showValid.set(event.checked);
  }


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
      this.rowData.set(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.setColsFromExcel(this.rowData());
      let mapDialog = this.dialog.open(MapTemplateComponent, {
        width: '50%',
        data: {
          colsFromExcel: this.colsFromExcel(),
          mapped: this.getMapped()
        }
      })
      mapDialog.afterClosed().subscribe((result: any) => {
        this.afterMapping(result);
        // this.mapping.set(result);
        // this.colDefs.set(this.importService.fields.map((field: any) => {
        //   return {
        //     field: this.mapping()?.[field.name] || '',
        //     required: field.required,
        //     headerName: field.name,
        //     type: 'string',
        //     cellRenderer: 'agTextCellRenderer',
        //     editable: true,
        //     cellClass: (params: any) => {
        //       if (field.required && (!params.value || params.value === '')) {
        //         return 'required-error';
        //       }
        //       return '';
        //     }
        //   }
        // }))
      });
    };
    reader.readAsArrayBuffer(file);
  }
  getMapped() {
    let preMapped: any = {}
    this.importService.fields.map((field: any) => {
      preMapped[field.name] = this.colsFromExcel().find((col: string) => col === field.name) ?? '';
    })
    return preMapped;
  }

  setColsFromExcel(dataList: any[]) {
    let colSet = new Set<string>();
    dataList.forEach((item: any) => {
      colSet = new Set([...colSet, ...Object.keys(item)]);
    });
    this.colsFromExcel.set([...colSet]);
  }
  downloadData() {
    console.log(this.filteredRowData);
    // this.stepper.next();
  }
  saveData() {

  }
  updateMapping() {
    let mapDialog = this.dialog.open(MapTemplateComponent, {
      width: '50%',
      data: {
        colsFromExcel: this.colsFromExcel(),
        mapped: this.mapping()
      }
    })
    mapDialog.afterClosed().subscribe((result: any) => {
      this.afterMapping(result);
    })
  }

  afterMapping(result: any) {
    this.mapping.set(result);
    this.colDefs.set(this.importService.fields.map((field: any) => {
      return {
        field: this.mapping()?.[field.name] || '',
        required: field.required,
        headerName: field.name,
        type: 'string',
        cellRenderer: 'agTextCellRenderer',
        editable: true,
        cellClass: (params: any) => {
          if (field.required && (!params.value || params.value === '')) {
            return 'required-error';
          }
          return '';
        }
      }
    }))
  }

}
