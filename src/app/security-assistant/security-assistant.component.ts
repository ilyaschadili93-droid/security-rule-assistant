import { Component, OnInit } from '@angular/core';
import { SecurityRuleService } from '../services/security-rule.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Notification {
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

@Component({
  selector: 'app-security-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-assistant.component.html',
  styleUrls: ['./security-assistant.component.css']
})
export class SecurityAssistantComponent implements OnInit {

  rules: any[] = [];
  filteredRules: any[] = [];
  selectedRule: any = null;
  explanation = '';
  loading = false;
  searchText = '';
  showChecklist = true;
  notifications: Notification[] = [];

  constructor(private ruleService: SecurityRuleService) {}

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules() {
    fetch('/assets/data/csvjson.json')
      .then(res => res.json())
      .then((data: any) => {
        this.rules = Array.isArray(data) ? data : [];
        this.rules.forEach(r => r.selected = false);
        this.filteredRules = [...this.rules];
        this.showNotif(`${this.rules.length} security rules loaded`, 'info');
      })
      .catch(() => {
        this.rules = [];
        this.filteredRules = [];
        this.showNotif('Failed to load rules', 'error');
      });
  }

  toggleChecklist() {
    this.showChecklist = !this.showChecklist;
  }

  searchRules() {
    const search = this.searchText?.toLowerCase().trim();
    if (!search) {
      this.filteredRules = [...this.rules];
      return;
    }
    this.filteredRules = this.rules.filter(rule =>
      rule?.["Verification Requirement"]?.toLowerCase().includes(search)
    );
  }

  selectRule(rule: any) {
    if (this.selectedRule === rule) {
      this.selectedRule = null;
      this.explanation = '';
      return;
    }
    this.selectedRule = rule;
    this.explanation = '';
    this.showNotif('Rule selected — click Explain by AI', 'info');
  }

  onCheckboxChange(rule: any) {
    const count = this.rules.filter(r => r.selected).length;
    const score = Math.round((count / this.rules.length) * 100);

    if (rule.selected) {
      this.showNotif(`Rule implemented — Score: ${score}%`, 'success');
      if (score >= 70) this.showNotif('🎉 Compliance above 70%!', 'success');
    } else {
      this.showNotif(`Rule removed — Score: ${score}%`, 'warning');
    }

    this.filteredRules = [...this.filteredRules];
  }

  explainRule() {
    if (!this.selectedRule) return;
    this.loading = true;
    this.explanation = '';
    this.showNotif('AI analysis started...', 'info');

    const text = this.selectedRule?.["Verification Requirement"] || '';

    this.ruleService.getAIExplanation(text).subscribe({
      next: (res: any) => {
        this.explanation = res?.answer || res?.response || "No explanation available";
        this.loading = false;
        this.showNotif('AI analysis complete', 'success');
      },
      error: () => {
        this.explanation = "AI explanation error. Please try again.";
        this.loading = false;
        this.showNotif('AI analysis failed', 'error');
      }
    });
  }

  speakText(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
    this.showNotif('Text-to-speech activated', 'info');
  }

  calculateScore() {
    if (!this.rules.length) return 0;
    const implemented = this.rules.filter(r => r?.selected).length;
    return Math.round((implemented / this.rules.length) * 100);
  }

  getImplementedCount() {
    return this.rules.filter(r => r?.selected).length;
  }

  showNotif(message: string, type: Notification['type']) {
    const notif: Notification = { message, type };
    this.notifications.push(notif);
    setTimeout(() => {
      this.notifications = this.notifications.filter(n => n !== notif);
    }, 3000);
  }
}
