import { Injectable, signal } from '@angular/core';
import { NavLink } from './navbar.model';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private navLinksSignal = signal<NavLink[]>([]);
  private showLoginSignal = signal(false);
  private showLogoSignal = signal(false);
  private logo = signal<string>('');
  private menuOpen = signal(false);
  private navIcone = signal('');
  private profile = signal(false);
  private profileImg = signal('');
  navLinks = this.navLinksSignal.asReadonly();
  showLogin = this.showLoginSignal.asReadonly();
  showLogo = this.showLogoSignal.asReadonly();
  logoUrl = this.logo.asReadonly();
  isMenyOpen = this.menuOpen.asReadonly();
  showNavIcone = this.navIcone.asReadonly();
  showProfile = this.profile.asReadonly();
  addProfileImng = this.profileImg.asReadonly();

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }
  setNavLinks(links: NavLink[]) {
    this.navLinksSignal.set(links);
  }
  setShowProfile(show: boolean) {
    this.profile.set(show);
  }
  setLogo(logo: string) {
    this.logo.set(logo);
  }
  setprofileImage(image: string) {
    this.profileImg.set(image);
  }

  setIcone(icone: string) {
    this.navIcone.set(icone);
  }

  toggleLogin(show: boolean) {
    this.showLoginSignal.set(show);
  }

  toggleLogo(show: boolean) {
    this.showLogoSignal.set(show);
  }
}
