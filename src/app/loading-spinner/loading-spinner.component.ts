import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingSpinnerService } from '../services/loading-spinner.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {

  public isLoading?: Subject<boolean>;

  public constructor(
    private loadingSpinnerService: LoadingSpinnerService
  ) {
    this.isLoading = this.loadingSpinnerService.isLoading;
  }
}
