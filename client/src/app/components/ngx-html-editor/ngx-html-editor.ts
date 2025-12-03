import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-ngx-html-editor',
  standalone: true,
  imports: [FormsModule, NgxEditorModule],
  templateUrl: './ngx-html-editor.html',
  styleUrls: ['./ngx-html-editor.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NgxHtmlEditor implements OnInit, OnDestroy {
  @Input() initialContent: string = '';
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  html: string = '';
  originalContent: string = '';
  editor!: Editor;
  isDirty = false;

  toolbar: Toolbar = [
    ['undo', 'redo'],
    ['bold', 'italic', 'underline', 'strike'],
    ['bullet_list', 'ordered_list', 'indent', 'outdent'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['blockquote', 'code', 'horizontal_rule'],
    ['link'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();
    this.html = this.initialContent || '';
    this.originalContent = this.normalizeHtml(this.initialContent);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  normalizeHtml(html: string): string {
    return (html || '').replace(/\s+/g, ' ').replace(/> </g, '><').trim();
  }

  onContentChange(): void {
    const current = this.normalizeHtml(this.html);
    this.isDirty = current !== this.originalContent;
  }

  onSave(): void {
    const current = this.normalizeHtml(this.html);
    if (current !== this.originalContent) {
      this.save.emit(this.html);
      this.originalContent = current;
    }
    this.isDirty = false;
  }
  get isEmpty(): boolean {
    return !this.html || this.html.trim() === '' || this.html === '<p></p>';
  }

  onCancel(): void {
    this.cancel.emit();
    this.isDirty = false;
  }
}
