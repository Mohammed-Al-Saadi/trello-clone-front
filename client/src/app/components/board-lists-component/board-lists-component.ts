import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../services/tasks';
import { BoardListService } from '../../services/board-list';
import { ConfirmDelete } from '../confirm-delete/confirm-delete';
import { getShortNameUtil } from '../../utils/main.projects.utils';
import { AuthService } from '../../services/auth';
import { CardContentService } from '../../services/card_content';
import { CardMembershipService } from '../../services/cards-memberships';
import { CardContent } from '../card-content/card-content';
import { ModelView } from '../model-view/model-view';

@Component({
  selector: 'app-board-lists',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    NgClass,
    DatePipe,
    ConfirmDelete,
    CardContent,
    ModelView,
  ],
  templateUrl: './board-lists-component.html',
  styleUrls: ['./board-lists-component.css'],
})
export class BoardListsComponent {
  @Input() lists: any[] = [];
  @Output() refresh = new EventEmitter<void>();
  @Input() boardMembers: any[] = [];

  tasksService = inject(TasksService);
  boardListService = inject(BoardListService);
  auth = inject(AuthService);
  cardContentService = inject(CardContentService);
  cardMembershipService = inject(CardMembershipService);

  showAddCard = signal<number | null>(null);
  noCardTitle = signal(false);

  cardTitleTouched = false;
  newCardTitle = '';
  newCardPriority = '';

  selectedListId = signal<number | null>(null);
  showDeleteListModal = signal(false);

  showDeleteCardModal = signal(false);
  selectedCardId = signal<number | null>(null);

  openMenuCardId: number | null = null;

  SelectedCard = signal<any | null>(null);
  showCardContent = signal<number | null>(null);

  constructor() {
    document.addEventListener('click', this.onOutsideClick);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  get listIds() {
    return this.lists?.map((l) => 'list-' + l.id) ?? [];
  }

  getShortName(name: string) {
    return getShortNameUtil(name);
  }

  async dropList(event: any) {
    if (!event.isPointerOverContainer) return;
    if (event.previousIndex === event.currentIndex) return;

    const oldLists = [...this.lists];
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.lists.forEach((l, i) => (l.position = i));

    const changed = this.lists.filter((newList, idx) => oldLists[idx]?.id !== newList.id);
    if (changed.length) await this.boardListService.updateListsPosition(this.lists);
  }

  async renameList(id: number, newName: string) {
    const list = this.lists.find((l) => l.id === id);
    if (!list) return;
    const normalizedOld = list.name.trim().toLowerCase();
    const normalizedNew = newName.trim().toLowerCase();
    if (normalizedOld !== normalizedNew) {
      await this.boardListService.updateListName(id, newName.trim());
      this.refresh.emit();
    }
  }

  onClickOpenDeleteList(listId: number) {
    this.selectedListId.set(listId);
    this.showDeleteListModal.set(true);
  }

  async handleDeleteList(confirm: boolean) {
    this.showDeleteListModal.set(false);
    if (!confirm) return;

    const listId = this.selectedListId();
    if (listId === null) return;

    await this.boardListService.deleteBoardList(listId);
    this.refresh.emit();
  }

  onOpenAddCard(listId: number) {
    this.showAddCard.set(this.showAddCard() === listId ? null : listId);
    this.newCardTitle = '';
    this.newCardPriority = '';
    this.noCardTitle.set(false);
  }

  async onSubmitCard(listId: number) {
    this.cardTitleTouched = true;
    if (!this.newCardTitle.trim()) {
      this.noCardTitle.set(true);
      return;
    }

    await this.tasksService.addNewtask(
      listId,
      this.newCardTitle.trim(),
      this.auth.user().id,
      this.newCardPriority
    );

    this.newCardTitle = '';
    this.newCardPriority = '';
    this.showAddCard.set(null);
    this.cardTitleTouched = false;
    this.refresh.emit();
  }

  async dropCard(event: any, targetList: any) {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;

    if (!event.isPointerOverContainer) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(currList, event.previousIndex, event.currentIndex);
      await this.tasksService.moveTasksInList(targetList.id, currList);
    } else {
      transferArrayItem(prevList, currList, event.previousIndex, event.currentIndex);
      const movedCard = currList[event.currentIndex];
      movedCard.list_id = targetList.id;
      await this.tasksService.moveTasksToOtherList(movedCard.id, targetList.id, event.currentIndex);
    }

    this.refresh.emit();
  }

  onOutsideClick = () => {
    if (this.openMenuCardId !== null) {
      this.openMenuCardId = null;
    }
  };

  toggleCardMenu(cardId: number, event: Event) {
    event.stopPropagation();
    this.openMenuCardId = this.openMenuCardId === cardId ? null : cardId;
  }

  openDeleteCard(cardId: number) {
    this.selectedCardId.set(cardId);
    this.showDeleteCardModal.set(true);
  }

  async handleDeleteCard(confirm: boolean) {
    this.showDeleteCardModal.set(false);
    if (!confirm) return;

    const cardId = this.selectedCardId();
    if (cardId === null) return;

    await this.tasksService.deleteTask(cardId);
    this.refresh.emit();
  }

  async showCardContentModel(card: any) {
    this.selectedCardId.set(card.id);
    this.SelectedCard.set(card);
    this.showCardContent.set(card.id);
  }

  closeEditor() {
    this.showCardContent.set(null);
  }

  getPriorityClass(priority: string) {
    return priority?.split(' ')[0]?.toLowerCase() ?? '';
  }
}
