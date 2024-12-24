import { Component, inject } from '@angular/core'
import { AccountService } from '../../account.service'
import { Router, RouterModule } from '@angular/router'

@Component({
    selector: 'app-admin',
    templateUrl: './admin.page.html',
    imports: [RouterModule],
    standalone: true,
})
export class AdminComponent {
    accountService = inject(AccountService)
    router = inject(Router)

    goToManageOrders(): void {
        this.router.navigate(['admin/orders'])
    }

    goToManageDriver(): void {
        this.router.navigate(['admin/users'])
    }
}
