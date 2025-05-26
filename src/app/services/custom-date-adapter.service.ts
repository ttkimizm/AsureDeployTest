import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class CustomDateAdapterService extends NativeDateAdapter {

  public override getDateNames(): string[] {
    const dateNames: string[] = [];
    for (let i = 0; i < 31; i++) {
      dateNames[i] = String(i + 1);
    }
    return dateNames;
  }

  public override getYearName(date: Date): string {
    return String(date.getFullYear());
  }
}
