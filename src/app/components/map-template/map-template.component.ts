import { Component, Inject, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ImportService } from '../../services/import/import.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-map-template',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './map-template.component.html',
  styleUrl: './map-template.component.css'
})
export class MapTemplateComponent {
  colsFromExcel = signal<string[]>([]);
  importService = inject(ImportService);
  fields = this.importService.fields;

  // Mapping: { [fieldName]: excelColName }
  mapping: { [field: string]: string } = {};

  constructor(
    public dialogRef: MatDialogRef<MapTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { colsFromExcel: string[], mapped?: { [field: string]: string } },
  ) {
    this.colsFromExcel.set(this.data.colsFromExcel);
    console.log(this.colsFromExcel());
    // Preselect mapped data if provided
    if (data.mapped) {
      this.mapping = { ...data.mapped };
    } else {
      // Optionally, initialize with empty mapping
      this.fields.forEach((field: any) => {
        this.mapping[field.name] = '';
      });
    }
  }

  onMappingChange(fieldName: string, colName: string) {
    console.log(fieldName, colName);
    this.mapping[fieldName] = colName;
  }

  onSubmit() {
    // You can emit or use this.mapping as needed
    // For example, close dialog and pass mapping
    this.dialogRef.close(this.mapping);
    // Or, alternatively, pass mapping to ag-grid
    // this.importService.processMapping(this.mapping);
  }
}
