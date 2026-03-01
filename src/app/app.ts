import { Component } from '@angular/core';
import { SecurityAssistantComponent } from './security-assistant/security-assistant.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SecurityAssistantComponent],
  template: `<app-security-assistant></app-security-assistant>`,
  styleUrls: ['./app.css']
})
export class AppComponent {}