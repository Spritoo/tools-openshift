import { Component, inject } from '@angular/core'
import { AccountService } from '../../account.service'
import { Router, RouterModule } from '@angular/router'

@Component({
    selector: 'app-courier',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './courier.page.html',
})
export class CourierComponent {
    accountService = inject(AccountService)
    router = inject(Router)

    goToAssignedOrders(): void {
        this.router.navigate(['courier/orders'])
    }

    goToUpdateOrdersStatus(): void {
        this.router.navigate(['courier/status'])
    }
}
