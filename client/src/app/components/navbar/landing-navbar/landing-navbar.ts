import {
  Component,
  ContentChild,
  TemplateRef,
  input,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavLink } from '../navbar.model';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './landing-navbar.html',
  styleUrls: ['./landing-navbar.css'],
})
export class LandingNavbar implements OnInit, OnDestroy {
  navLinks = input<NavLink[]>([]);
  logoUrl = input<string>('');
  isMobileOpen = signal(false);

  @ContentChild('landingAuth', { read: TemplateRef })
  authTpl?: TemplateRef<unknown>;

  private resizeListener!: () => void;
  private clickListener!: (event: MouseEvent) => void;

  constructor(private elRef: ElementRef) {}

  toggleMobileMenu() {
    this.isMobileOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.isMobileOpen.set(false);
  }

  ngOnInit() {
    // ✅ Close menu when resizing to desktop width
    this.resizeListener = () => {
      if (window.innerWidth > 768 && this.isMobileOpen()) {
        this.closeMobileMenu();
      }
    };
    window.addEventListener('resize', this.resizeListener);

    // ✅ Close menu when clicking outside
    this.clickListener = (event: MouseEvent) => {
      const menu = this.elRef.nativeElement.querySelector('.landing-mobile');
      const toggleBtn = this.elRef.nativeElement.querySelector('.landing-nav__mobile-btn');

      if (
        this.isMobileOpen() &&
        menu &&
        !menu.contains(event.target as Node) &&
        toggleBtn &&
        !toggleBtn.contains(event.target as Node)
      ) {
        this.closeMobileMenu();
      }
    };

    document.addEventListener('click', this.clickListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
    document.removeEventListener('click', this.clickListener);
  }
}
