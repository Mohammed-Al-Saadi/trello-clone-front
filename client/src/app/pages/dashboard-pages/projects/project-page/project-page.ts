import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LinkButton } from '../../../../components/link-button/link-button';
import { DashboardInfoPanel } from '../../../../components/dashboard-info-panel/dashboard-info-panel';
import { Validators } from '@angular/forms';
import { FormItems, ReactiveForm } from '../../../../components/reactive-form/reactive-form';
import { ModelView } from '../../../../components/model-view/model-view';
import { BoardService } from '../../../../services/board-service';
import { BoardPage } from '../board-page/board-page';
import { AuthService } from '../../../../services/auth';
import { ProjectsService } from '../../../../services/projects-service';
import { ProjectMembership } from '../../../../services/project-membership';

@Component({
  selector: 'app-project-page',
  standalone: true,
  templateUrl: './project-page.html',
  styleUrl: './project-page.css',
  imports: [LinkButton, DashboardInfoPanel, ModelView, ReactiveForm],
})
export class ProjectPage {
  route = inject(ActivatedRoute);
  projectId = this.route.snapshot.params['project_id'];
  projectMembership = inject(ProjectMembership);

  showModel = signal<boolean>(false);
  showAddMemberModel = signal<boolean>(false);
  auth = inject(AuthService);
  roles = this.auth.roles;
  user = this.auth.user;

  boardService = inject(BoardService);
  boardsData = signal<any[]>([]);
  router = inject(Router);
  addMemberformData = signal<FormItems[]>([
    {
      label: 'Email *',
      type: 'email',
      formControlName: 'email',
      placeholder: 'Your email...',
      validators: [Validators.required, Validators.email],
      options: [],
    },
    {
      label: 'Select Board *',
      type: 'select',
      formControlName: 'board',
      placeholder: 'Select board.. ',
      options: [],

      validators: [Validators.required],
      allowTyping: false,
    },
    {
      label: 'Select Role *',
      type: 'select',
      formControlName: 'roles',
      placeholder: 'Select role.. ',
      options: this.roles()
        .filter((item) => item.name.toLowerCase().startsWith('project'))
        .map((item) => item.name),

      validators: [Validators.required],
      allowTyping: false,
    },
  ]);

  formData = signal<FormItems[]>([
    {
      label: 'Board Name *',
      type: 'text',
      formControlName: 'board_name',
      placeholder: 'Your board...',
      validators: [Validators.required],
      options: [],
    },
  ]);

  async ngOnInit() {
    const result: any = await this.boardService.getBoards(this.projectId, this.user().id);
    this.boardsData.set(result);

    const boardNames = this.boardsData().map((b) => b.name);

    this.addMemberformData.update((items) => {
      const boardField = items.find((item) => item.formControlName === 'board');
      if (boardField) boardField.options = boardNames;

      return [...items];
    });
  }

  onClickOpenAddBoard() {
    this.showModel.update((value) => !value);
  }
  onClickOpenAddMember() {
    this.showAddMemberModel.update((value) => !value);
  }
  async onSubmiteNewMember(formData: any) {
    try {
      const selectedRoleName = formData.roles;
      const selectedBoardName = formData.board;
      const board_id = this.boardsData().find((r) => r.name === selectedBoardName).id;
      const role_id = this.roles().find((r) => r.name === selectedRoleName).id;
      const added_by = this.user().id;
      console.log(this.projectId, board_id, formData.email, role_id, added_by);
      const res = await this.projectMembership.addProjectMembership(
        this.projectId,
        board_id,
        role_id,
        formData.email,
        added_by
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  async onSubmiteNewBoard(formData: any) {
    try {
      const result = await this.boardService.addNewBoard(this.projectId, formData.board_name, 0);
      this.showModel.set(false);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  }

  goTobordId(projectId: number, boardId: number) {
    this.router.navigate(['/dashboard/projects', projectId, 'boards', boardId]);
  }
  goBack() {
    history.back();
  }
}
