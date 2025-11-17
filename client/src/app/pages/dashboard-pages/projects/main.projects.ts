import { Component, inject, signal } from '@angular/core';
import { DashboardInfoPanel } from '../../../components/dashboard-info-panel/dashboard-info-panel';
import { LinkButton } from '../../../components/link-button/link-button';
import { ModelView } from '../../../components/model-view/model-view';
import { FormItems, ReactiveForm } from '../../../components/reactive-form/reactive-form';
import { FormsModule, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { SrpRegisterService } from '../../register/srp-register-service';
import { SrpAuthService } from '../../login-page/srp-auth';
import { Router } from '@angular/router';
import { ToastService } from '../../../components/reusable-toast/toast-service';
import { ProjectsService } from '../../../services/projects-service';
import { NgFor, UpperCasePipe } from '@angular/common';
import { selectUser } from '../../../store/selectors';
import { Store } from '@ngrx/store';
import { Card } from '../../../components/card/card';

@Component({
  selector: 'app-management',
  imports: [DashboardInfoPanel, LinkButton, ModelView, ReactiveForm, UpperCasePipe, FormsModule],
  templateUrl: './main.projects.html',
  styleUrl: './main.projects.css',
})
export class Management {
  logOutService = inject(SrpAuthService);
  router = inject(Router);
  toast = inject(ToastService);
  addProject = inject(ProjectsService);
  projectsData = signal<any[]>([]);
  showModel = signal<boolean>(false);
  showEditModel = signal<boolean>(false);
  selectedProject = signal<any>(null);
  owner_id = signal<any>(null);
  searchQuery: string = '';
  allProjects = signal<any[]>([]);
  ownerFilter = signal<'all' | 'me' | 'others'>('all');

  private store = inject(Store);
  userDataState = this.store.selectSignal(selectUser);

  formData = signal<FormItems[]>([
    {
      label: 'Project Name *',
      type: 'text',
      formControlName: 'project_name',
      placeholder: 'Your project...',
      validators: [Validators.required],
      options: [],
    },
    {
      label: 'Description *',
      type: 'textarea',
      formControlName: 'description',
      placeholder: 'Description...',
      validators: [Validators.required],
      options: [],
    },
    {
      label: 'Category',
      type: 'select',
      formControlName: 'category',
      placeholder: 'Choose or type a category',
      options: ['Web App', 'Mobile App', 'AI Tool', 'Internal'],
      validators: [Validators.required],
      allowTyping: true,
    },
    {
      label: 'Start Date',
      type: 'date',
      formControlName: 'start_date',
      validators: [],
      options: [],
      placeholder: 'Description...',
    },
  ]);
  applyFilters() {
    const query = this.searchQuery.toLowerCase().trim();
    const userId = this.userDataState().id;

    let filtered = this.allProjects();
    if (query) {
      filtered = filtered.filter((project) => project.name.toLowerCase().includes(query));
    }
    const owner = this.ownerFilter();

    if (owner === 'me') {
      filtered = filtered.filter((project) => project.owner_id === userId);
    } else if (owner === 'others') {
      filtered = filtered.filter((project) => project.owner_id !== userId);
    }

    this.projectsData.set(filtered);
  }

  onSearchChange() {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.projectsData.set(this.allProjects());
      return;
    }

    const filtered = this.allProjects().filter((project) =>
      project.name.toLowerCase().includes(query)
    );

    this.projectsData.set(filtered);
  }

  goToProject(projectId: string | number) {
    this.router.navigate(['/dashboard/projects', projectId]);
  }

  async ngOnInit() {
    const userId = this.userDataState().id;
    const data: any = await this.addProject.getAllProjects(userId);
    this.projectsData.set(data);
    this.allProjects.set(data);
  }
  async onSubmitEditForm(formValue: any) {
    const owner_id = this.userDataState().id;
    const project = this.selectedProject();

    const result = await this.addProject.updateProject(
      owner_id,
      project.id,
      formValue.project_name,
      formValue.description,
      formValue.category,
      formValue.created_at
    );
    console.log(result);

    this.showEditModel.set(false);
  }

  async onSubmiteNewProject(formData: any) {
    const userId = this.userDataState().id;
    const name = formData.project_name;
    const description = formData.description;
    const owner_id = userId;
    const category = formData.category;
    const res: any = await this.addProject.addNewProject(name, description, owner_id, category);
  }

  onDeleteProject(project_id: number, owner_id: number) {
    this.addProject.deleteProject(project_id, owner_id);
  }

  onEditFormData(project: any) {
    this.showEditModel.set(true);
    this.selectedProject.set(project);

    this.formData.update((fields: any[]) =>
      Array.isArray(fields)
        ? fields.map((item) => {
            switch (item.formControlName) {
              case 'project_name':
                return { ...item, value: project.name || '' };
              case 'description':
                return { ...item, value: project.description || '' };
              case 'category':
                return { ...item, value: project.category || '' };
              case 'start_date':
                const formattedDate = new Date(project.created_at).toISOString().split('T')[0];
                return { ...item, value: formattedDate || '' };

              default:
                return item;
            }
          })
        : []
    );
  }

  onClickColseEdit() {
    this.showEditModel.update((value) => !value);
    if (this.showEditModel() === false) {
      this.formData.update((fields: any[]) => fields.map((item) => ({ ...item, value: '' })));
      this.selectedProject.set(null);
    }
  }

  onClickAddProject() {
    this.showModel.update((value) => !value);
  }
}
