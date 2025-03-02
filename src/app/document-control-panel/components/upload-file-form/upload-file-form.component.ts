import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-file-form',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './upload-file-form.component.html',
  styleUrl: './upload-file-form.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileFormComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileFormComponent implements ControlValueAccessor {
  onChange: (value: any) => void;
  onTouched: () => void;
  isDisabled = false;

  file: File;
  fileName: string;

  onFileSelected(event) {
    if (this.isDisabled) {
      return;
    }

    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.onChange(file);
      this.onTouched();
    }
  }

  writeValue(file: any): void {
    this.file = file;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
