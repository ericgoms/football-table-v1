import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  showToast(message: string, type: 'success' | 'error') {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, { message, type }]);

    setTimeout(() => {
      this.removeToast(message);
    }, 3000);
  }

  private removeToast(message: string) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.message !== message));
  }
}