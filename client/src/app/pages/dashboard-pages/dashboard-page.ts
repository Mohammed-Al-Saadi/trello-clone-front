import { Component, computed, effect, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarService } from '../../components/navbar/navbar-service';
import { NavLink } from '../../components/navbar/navbar.model';
import { ModelView } from '../../components/model-view/model-view';
import { SrpAuthService } from '../login-page/srp-auth';
import { Router } from '@angular/router';
import { ToastService } from '../../components/reusable-toast/toast-service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.css'],
  standalone: true,
})
export class Dashboard {
  private navbarService = inject(NavbarService);
  navLinks = computed(() => this.navbarService.navLinks());
  showLogin = computed(() => this.navbarService.showLogin());
  showLogo = computed(() => this.navbarService.showLogo());
  logo = computed(() => this.navbarService.logoUrl());
  isMenuOpen = computed(() => this.navbarService.isMenyOpen());
  showProfile = computed(() => this.navbarService.showProfile());
  profileImage = computed(() => this.navbarService.addProfileImng());
  logOutService = inject(SrpAuthService);
  auth = inject(AuthService);

  router = inject(Router);
  toast = inject(ToastService);
  private defaultLinks: NavLink[] = [
    { label: 'Projects', path: 'projects', icon: 'fa-solid fa-folder-plus' },
    { label: 'Settings', path: 'settings', icon: 'fa-solid fa-gear' },
  ];
  logout() {
    this.logOutService.logout().then((res) => {
      if (res === true) {
        this.toast.showMessage({ id: 1, type: 'success', text: 'Logout successful' });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      } else {
        console.warn('Logout failed or server error');
      }
    });
  }
  ngOnInit() {
    this.navbarService.setNavLinks(this.defaultLinks);
    this.navbarService.setLogo('assets/logo.png');
    this.navbarService.toggleLogin(false);
    this.navbarService.toggleLogo(false);
    this.navbarService.setShowProfile(true);
    this.navbarService.setprofileImage('assets/profile.png');
  }
}
