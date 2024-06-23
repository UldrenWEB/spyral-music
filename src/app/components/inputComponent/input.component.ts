import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-component',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() label: string = '';
  @Input() labelPlacement: 'floating' | 'fixed' | 'stacked' = 'floating';
  @Input() counter: boolean = true;
  @Input() maxlength: number = 20;
  @Input() value: string = '';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}