import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AccountService } from '../account/account.service'

@Component({
    standalone: true,
    templateUrl: './dashboard.page.html',
})
export class DashboardComponent implements OnInit {
    accountService = inject(AccountService)
    router = inject(Router)

    ngOnInit() {
        const userRole = this.accountService?.getUserRole ?? ''

        // Redirect based on the role
        if (userRole === 'admin') {
            this.router.navigate(['admin'])
        } else if (userRole === 'driver') {
            this.router.navigate(['courier'])
        } else if (userRole === 'seller') {
            this.router.navigate(['seller'])
        } else {
            this.router.navigate(['/login'])
        }
    }
}
