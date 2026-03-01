import { Component, OnInit } from '@angular/core';
import { SecurityRuleService } from '../services/security-rule.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private ruleService: SecurityRuleService) {}

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules() {

    this.ruleService.getRules().subscribe({
      next: (data: any) => {

        this.rules = Array.isArray(data) ? data : [];
        this.rules.forEach(r => r.selected = false);

        this.filteredRules = [...this.rules];

      },

      error: () => {
        this.rules = [];
        this.filteredRules = [];
      }
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
      rule?.["Verification Requirement"]
        ?.toLowerCase()
        .includes(search)
    );

  }

  selectRule(rule: any) {

    this.rules.forEach(r => {
      r.selected = (r === rule);
    });

    this.filteredRules = [...this.rules];

    this.selectedRule = rule;

    this.explanation = '';

  }

  explainRule() {

    if (!this.selectedRule) return;

    this.loading = true;

    const text = this.selectedRule?.["Verification Requirement"] || '';

    this.ruleService.getAIExplanation(text).subscribe({

      next: (res: any) => {

        this.explanation =
          res?.answer ||
          res?.response ||
          "No explanation available";

        this.loading = false;
      },

      error: () => {

        this.explanation = "AI explanation error";
        this.loading = false;
      }

    });

  }

  speakText(text: string) {

    if (!('speechSynthesis' in window)) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';

    window.speechSynthesis.speak(speech);
  }

  calculateScore() {

    if (!this.rules.length) return 0;

    const implemented = this.rules.filter(r => r?.selected).length;

    return Math.round((implemented / this.rules.length) * 100);
  }

}