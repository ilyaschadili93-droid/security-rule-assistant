import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityRuleService {

  getRules(): Observable<any[]> {
    return new Observable(observer => {
      fetch('/assets/data/csvjson.json')
        .then(res => res.json())
        .then(data => {
          observer.next(Array.isArray(data) ? data : []);
          observer.complete();
        })
        .catch(() => {
          observer.next([]);
          observer.complete();
        });
    });
  }

  getAIExplanation(text: string): Observable<any> {
    if (!text) return of({ answer: "No security rule selected." });

    return of({
      answer:
        `📋 Rule Analysis:\n\n` +
        `"${text}"\n\n` +
        `✅ This rule is part of the OWASP ASVS standard.\n\n` +
        `🔐 Why it matters: It prevents common attack vectors by enforcing strict verification at the application level.\n\n` +
        `💡 Tip: Validate all inputs server-side, sanitize outputs, and apply the principle of least privilege.`
    });
  }
}