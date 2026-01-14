import { Component } from '@angular/core';
import { Dashboard } from "../../pages/dashboard/dashboard";
import { AdminNavbar } from "../../shared/components/admin-navbar/admin-navbar";
import { Sidebar } from "../../shared/components/sidebar/sidebar";

@Component({
  selector: 'app-admin-layout',
  imports: [Sidebar, Dashboard, AdminNavbar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {

}
