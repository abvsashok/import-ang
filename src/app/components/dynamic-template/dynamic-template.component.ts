import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import * as ExcelJS from 'exceljs';
import { CommonModule } from '@angular/common';
import { ImportService } from '../../services/import/import.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dynamic-template',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './dynamic-template.component.html',
  styleUrls: ['./dynamic-template.component.scss']
})

export class DynamicTemplateComponent {
  importService = inject(ImportService);
  fields = this.importService.fields;
  selectedFields = signal<any[]>([]);
  requiredFields = signal<any[]>([]);

  constructor(
    public dialogRef: MatDialogRef<DynamicTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    // Initialize required fields
    this.requiredFields.set(this.fields.filter(f => f.required));
    // All required fields are selected by default
    this.selectedFields.set(this.fields.filter(f => f.required));
  }

  isSelected(field: any): boolean {
    return this.selectedFields().find((f: any) => f.name === field.name);
  }

  toggleField(selected: any) {
    const selectedValues = selected.selectedOptions.selected?.map((option: any) => option.value);
    this.selectedFields.set(selectedValues);
  }

  async handleDownload() {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template');

    // Get the selected fields as column headers
    const selectedFields = this.selectedFields();
    const columns = selectedFields.map((field: any) => ({ header: field.name, key: field.name }));
    worksheet.columns = columns;

    // Optionally, add a blank row (or more)
    worksheet.addRow({});

    // Generate buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}



