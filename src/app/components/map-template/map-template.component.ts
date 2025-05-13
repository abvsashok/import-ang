import { Component, Inject, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
    ReactiveFormsModule,
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

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MapTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { colsFromExcel: string[], mapped?: { [field: string]: string } },
    private fb: FormBuilder
  ) {
    this.colsFromExcel.set(this.data.colsFromExcel);
    // Build form with one control per field
    const group: { [key: string]: FormControl } = {};
    this.fields.forEach((field: any) => {
      group[field.name] = new FormControl(data.mapped?.[field.name] || '');
    });
    this.form = this.fb.group(group);
  }

  onSubmit() {
    // Get mapping from form values
    const mapping = this.form.value;
    this.dialogRef.close(mapping);
  }
}
