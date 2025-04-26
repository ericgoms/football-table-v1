import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';

  visible: boolean = false;

  ngOnInit() {
    this.showToast();
  }

  showToast() {
    this.visible = true;
    setTimeout(() => this.hideToast(), 3000);
  }

  hideToast() {
    this.visible = false;
  }
}