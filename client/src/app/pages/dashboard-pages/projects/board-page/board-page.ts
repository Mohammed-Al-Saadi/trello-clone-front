import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkButton } from '../../../../components/link-button/link-button';
import { DashboardInfoPanel } from '../../../../components/dashboard-info-panel/dashboard-info-panel';
import { FormItems, ReactiveForm } from '../../../../components/reactive-form/reactive-form';
import { ModelView } from '../../../../components/model-view/model-view';
import { Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-board-page',
  standalone: true,
  templateUrl: './board-page.html',
  styleUrl: './board-page.css',
  imports: [LinkButton, DashboardInfoPanel, ReactiveForm, ModelView],
})
export class BoardPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  roles = this.auth.roles;
  formData = signal<FormItems[]>([
    {
      label: 'Email *',
      type: 'email',
      formControlName: 'emial',
      placeholder: 'Your email...',
      validators: [Validators.required, Validators.email],
      options: [],
    },
    {
      label: 'Select Role *',
      type: 'select',
      formControlName: 'roles',
      placeholder: 'Select role.. ',
      options: ['Web App', 'Mobile App', 'AI Tool', 'Internal'],
      validators: [Validators.required],
      allowTyping: false,
    },
  ]);
  projectId = this.route.snapshot.params['project_id'];
  boardId = this.route.snapshot.params['board_id'];

  goBack() {
    history.back();
  }
  ngOnInit() {
    console.log('Board ID:', this.boardId);
    console.log('Project ID:', this.projectId);
  }
}
