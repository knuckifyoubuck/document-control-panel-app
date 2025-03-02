import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading: WritableSignal<boolean> = signal(false);

  showLoader() {
    this.isLoading.set(true);
  }
}
