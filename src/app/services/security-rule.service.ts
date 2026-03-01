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

    if (!text) {
      return of({
        answer: "No security rule selected."
      });
    }

    return new Observable(observer => {

      setTimeout(() => {

        observer.next({
          answer:
            "Security Analysis:\n\n" +
            "The rule \"" + text + "\" is related to web security protection.\n\n" +
            "Follow OWASP security best practices.\n" +
            "Validate inputs, sanitize data, and secure configuration."
        });

        observer.complete();

      }, 1000);

    });

  }

}