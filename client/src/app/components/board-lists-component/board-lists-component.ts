import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import {
  CdkDragMove,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../services/tasks';
import { BoardListService } from '../../services/board-list';
import { ConfirmDelete } from '../confirm-delete/confirm-delete';
import { getShortNameUtil } from '../../utils/main.projects.utils';
import { AuthService } from '../../services/auth';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board-lists',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, NgClass, DatePipe, ScrollingModule],
  templateUrl: './board-lists-component.html',
  styleUrls: ['./board-lists-component.css'],
})
export class BoardListsComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() lists: any[] = [];
  @Input() boardMembers: any[] = [];
  @Output() refresh = new EventEmitter<void>();
  @Output() openCard = new EventEmitter<any>();
  @Output() deleteList = new EventEmitter<number>();
  @Output() deleteCard = new EventEmitter<number>();
  route = inject(ActivatedRoute);
  tasksService = inject(TasksService);
  boardListService = inject(BoardListService);
  auth = inject(AuthService);

  projectId = this.route.snapshot.params['project_id'];
  boardName = history.state.boardName;
  boardRoleName = history.state.role_name;

  // Signals
  showAddCard = signal<number | null>(null);
  noCardTitle = signal(false);
  selectedListId = signal<number | null>(null);
  selectedCardId = signal<number | null>(null);
  showDeleteListModal = signal(false);
  showDeleteCardModal = signal(false);

  // Local state
  cardTitleTouched = false;
  newCardTitle = '';
  newCardPriority = '';
  activeListIndex = 0;

  @ViewChild('boardScroll', { static: false })
  boardScroll!: ElementRef<HTMLElement>;

  canScroll = false;

  private scrollEl: HTMLElement | null = null;

  constructor() {
    document.addEventListener('click', this.onOutsideClick);
  }
  onClickDeleteList(listId: number) {
    this.deleteList.emit(listId);
  }
  onClickDeleteCard(cardId: number) {
    this.deleteCard.emit(cardId);
  }
  ngAfterViewInit() {
    const el = this.boardScroll?.nativeElement;
    if (!el) return;
    this.scrollEl = el;

    const update = () => {
      this.updateCanScroll();
      this.updateActiveList();
    };

    window.addEventListener('resize', () => setTimeout(update, 0));

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    el.addEventListener('mousedown', (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.cdk-drag')) return;
      isDown = true;
      el.classList.add('is-panning');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => {
      isDown = false;
      el.classList.remove('is-panning');
    });

    el.addEventListener('mouseup', () => {
      isDown = false;
      el.classList.remove('is-panning');
    });

    el.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2;
      el.scrollLeft = scrollLeft - walk;
      this.updateCanScroll();
      this.updateActiveList();
    });

    /** Touch support **/
    el.addEventListener('touchstart', (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('.cdk-drag')) return;
      isDown = true;
      el.classList.add('is-panning');
      startX = e.touches[0].pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });

    el.addEventListener('touchend', () => {
      isDown = false;
      el.classList.remove('is-panning');
    });

    el.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - el.offsetLeft;
        const walk = (x - startX) * 1.2;
        el.scrollLeft = scrollLeft - walk;
        this.updateCanScroll();
        this.updateActiveList();
      },
      { passive: true }
    );
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lists']) {
      setTimeout(() => {
        this.updateCanScroll();
        this.updateActiveList();
      }, 0);
    }
  }

  updateActiveList() {
    const el = this.boardScroll?.nativeElement;
    if (!el) return;
    const listElements = Array.from(el.querySelectorAll('.board-list-column')) as HTMLElement[];
    if (!listElements.length) {
      this.activeListIndex = 0;
      return;
    }

    const containerRect = el.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    listElements.forEach((listEl, index) => {
      const rect = listEl.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const diff = Math.abs(center - containerCenter);
      if (diff < minDistance) {
        minDistance = diff;
        closestIndex = index;
      }
    });

    this.activeListIndex = closestIndex;
  }

  updateCanScroll() {
    const el = this.boardScroll?.nativeElement;
    if (!el) return;
    this.canScroll = el.scrollWidth > el.clientWidth + 1;
  }

  scroll(amount: number) {
    const el = this.boardScroll.nativeElement;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(() => {
      this.updateCanScroll();
      this.updateActiveList();
    }, 290);
  }

  get listIds() {
    return this.lists?.map((l) => 'list-' + l.id) ?? [];
  }

  getShortName(name: string) {
    return getShortNameUtil(name);
  }

  async dropList(event: any) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.lists.forEach((l, i) => (l.position = i));
    await this.boardListService.updateListsPosition(this.lists);
    this.updateCanScroll();
  }

  async renameList(id: number, newName: string) {
    const list = this.lists.find((l) => l.id === id);
    if (!list) return;
    const normalizedOld = list.name.trim().toLowerCase();
    const normalizedNew = (newName || '').trim().toLowerCase();
    if (normalizedOld !== normalizedNew) {
      await this.boardListService.updateListName(id, newName.trim(), this.projectId);
      this.refresh.emit();
      this.updateCanScroll();
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
    await this.boardListService.deleteBoardList(listId, this.projectId);
    this.refresh.emit();
    this.updateCanScroll();
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
    this.updateCanScroll();
  }

  async dropCard(event: any, targetList: any) {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;
    if (!event.isPointerOverContainer) return;
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex)
      return;

    if (event.previousContainer === event.container) {
      moveItemInArray(currList, event.previousIndex, event.currentIndex);
      await this.tasksService.moveTasksInList(targetList.id, currList);
    } else {
      transferArrayItem(prevList, currList, event.previousIndex, event.currentIndex);
      const movedCard = currList[event.currentIndex];
      movedCard.list_id = targetList.id;
      await this.tasksService.moveTasksToOtherList(movedCard.id, targetList.id, event.currentIndex);
    }
  }

  onOutsideClick = () => {};

  openDeleteCard(cardId: number) {
    this.selectedCardId.set(cardId);
    this.showDeleteCardModal.set(true);
  }

  async handleDeleteCard(confirm: boolean) {
    this.showDeleteCardModal.set(false);
    if (!confirm) return;
    const cardId = this.selectedCardId();
    if (cardId === null) return;
    await this.tasksService.deleteTask(cardId, this.projectId);
    this.refresh.emit();
  }

  async showCardContentModel(card: any) {
    this.selectedCardId.set(card.id);
    this.openCard.emit(card);
  }

  getPriorityClass(priority: string) {
    return priority?.split(' ')[0]?.toLowerCase() ?? '';
  }

  getDueClass(dateString: string) {
    const due = new Date(dateString);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'soon';
    return 'normal';
  }
}
