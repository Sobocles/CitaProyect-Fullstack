// paginator.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() totalItems: number = 0;
  @Input() offset: number = 0;
  @Input() pageSize: number = 5;

  @Output() offsetChange: EventEmitter<number> = new EventEmitter<number>();

  // Agrega esta línea para exponer Math en el template:
  public Math = Math;

  changePage(delta: number): void {
    let newOffset = this.offset + delta;

    if (newOffset < 0) {
      newOffset = 0;
    } else if (newOffset >= this.totalItems) {
      newOffset = this.offset;
    }

    if (newOffset !== this.offset) {
      this.offset = newOffset;
      this.offsetChange.emit(this.offset);
    }
  }
}
