import { Injectable } from '@angular/core';
import { driver } from 'driver.js';

@Injectable({ providedIn: 'root' })
export class TutorialService {
  private driverObj;
  private tutorialSteps: any[] = [];
  private currentStep = 0;
  private continueAcrossPages = false;

  constructor() {
    this.driverObj = driver({
      showProgress: true,
      allowClose: true,
      onNextClick: () => this.handleNext(),
      onCloseClick: () => {
        this.driverObj.destroy();
        console.log('❌ Tutorial closed');
      },
    });
  }

  initTutorial(steps: any[], continueAcrossPages = false) {
    this.continueAcrossPages = continueAcrossPages;

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
    this.currentStep = 0;
    this.driverObj.setSteps(this.tutorialSteps);
    this.driverObj.drive();
  }

  private handleNext() {
    const step = this.tutorialSteps[this.currentStep];

    // ✅ If this step explicitly wants DONE
    const hasDoneButton = step.popover?.showButtons?.includes('done');

    // 🔹 Navigation step
    if (step.route || step.element === '[tourAnchor="ProjectCard"]') {
      const el = document.querySelector(step.element) as HTMLElement | null;
      if (el) el.click();
      this.driverObj.destroy();
      return;
    }

    // 🔹 DONE button logic (explicit OR last step)
    if (hasDoneButton || this.currentStep === this.tutorialSteps.length - 1) {
      this.driverObj.destroy();
      return;
    }

    // 🔹 NEXT
    this.currentStep++;
    this.driverObj.drive(this.currentStep);
  }
}
