import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Navbar } from '../components/navbar/navbar';
import { Footer } from '../components/footer/footer';
import { NavbarService } from '../components/navbar/navbar-service';
import { NavLink } from '../components/navbar/navbar.model';
import { LinkButton } from '../components/link-button/link-button';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-with-navbar-layout',
  standalone: true,
  imports: [Navbar, LinkButton, Footer],
  templateUrl: './with-navbar-layout.html',
  styleUrl: './with-navbar-layout.css',
})
export class WithNavbarLayout implements OnInit {
  private navbarService = inject(NavbarService);
  private router = inject(Router);
  private auth = inject(AuthService);

  navLinks = computed(() => this.navbarService.navLinks());
  showLogin = computed(() => this.navbarService.showLogin());
  showLogo = computed(() => this.navbarService.showLogo());
  logo = computed(() => this.navbarService.logoUrl());
  showProfile = computed(() => this.navbarService.showProfile());

  private defaultLinks: NavLink[] = [
    { label: 'Home', path: '/', icon: '' },
    { label: 'Feature', path: '/feature', icon: '' },
    { label: 'About', path: '/about', icon: '' },
  ];

  ngOnInit() {
    this.navbarService.setNavLinks(this.defaultLinks);
    this.navbarService.setLogo('assets/logo.png');
    this.navbarService.toggleLogin(false);
    this.navbarService.toggleLogo(false);
    this.navbarService.setShowProfile(false);
  }

  async onLoginClick() {
    const user = await this.auth.checkAuth();
    if (user) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
