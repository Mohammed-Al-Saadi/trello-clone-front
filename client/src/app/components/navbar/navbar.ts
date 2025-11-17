import { Component, inject, input, Input, output, Output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavLink } from './navbar.model';
import { CommonModule } from '@angular/common';
import { NavbarService } from './navbar-service';
import { DashboardInfoPanel } from '../dashboard-info-panel/dashboard-info-panel';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterOutlet, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  private navBarService = inject(NavbarService);

  navLinks = input<NavLink[]>([]);
  showLogin = input<boolean>(false);
  showLogo = input<boolean>(false);
  logo = input<string>('');
  navbarClass = input<string>('');
  showProfileName = input<boolean>(false);
  showMenuIcon = input<boolean>(false);
  showProfileImage = input<boolean>(false);
  profileImage = input<string>('');

  toggleMenu() {
    this.navBarService.toggleMenu();
  }

  get checkMenuOpen() {
    return this.navBarService.isMenyOpen();
  }
}
