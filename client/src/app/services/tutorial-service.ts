import { inject, Injectable } from '@angular/core';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { selectUser } from '../store/selectors';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TutorialService {
  private driverObj;
  private tutorialSteps: any[] = [];
  private currentStep = 0;

  private store = inject(Store);
  private http = inject(HttpClient);

  private BASE_URL = environment.API_BASE_URL;

  userDataState = this.store.selectSignal(selectUser);

  constructor() {
    this.driverObj = driver({
      showProgress: true,
      allowClose: true,
      onNextClick: () => this.handleNext(),
      onCloseClick: () => this.handleClose(),
    });
  }

  restartTutorialClientOnly() {
    const user = { ...this.userDataState() };
    user.tour_completed = false;

    this.currentStep = 0;
    this.driverObj.setSteps(this.tutorialSteps);
    this.driverObj.drive();
  }

  initTutorial(steps: any[]) {
    this.tutorialSteps = steps.map((step) => {
      const popover: any = {
        title: step.title,
        description: step.description,
        side: step.side || 'bottom',
        align: step.align || 'start',
        showButtons: ['close'],
      };

      if (step.showButtons) {
        popover.showButtons = step.showButtons;
      }

      return {
        element: step.element ?? 'body',
        popover,
        route: step.route,
        action: step.action,
      };
    });
  }

  startTutorial() {
    const user = this.userDataState();
    if (!user?.tour_completed) {
      this.currentStep = 0;
      this.driverObj.setSteps(this.tutorialSteps);
      this.driverObj.drive();
    }
  }

  private handleNext() {
    const step = this.tutorialSteps[this.currentStep];

    if (step.route || step.element === '[tourAnchor="ProjectCard"]') {
      const el = document.querySelector(step.element) as HTMLElement | null;
      if (el) el.click();
      this.driverObj.destroy();
      return;
    }

    this.currentStep++;
    this.driverObj.drive(this.currentStep);
  }
  private handleClose() {
    this.driverObj.destroy();
    const user = this.userDataState();
    if (!user?.tour_completed) {
      this.http
        .put(
          `${this.BASE_URL}/update-tutorial-status`,
          { user_id: user.id },
          {
            withCredentials: true,
          }
        )
        .subscribe({
          next: (res) => console.log('Tutorial status updated', res),
          error: (err) => console.error('Error updating tutorial status', err),
        });
    }
  }
}
