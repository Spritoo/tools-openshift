import { Component, inject } from '@angular/core'
import { AccountService } from '../../account.service'
import { Router, RouterModule } from '@angular/router'

@Component({
    selector: 'app-seller',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './seller.page.html',
})
export class SellerComponent {
    accountService = inject(AccountService)
    router = inject(Router)

    goToCreateOrders(): void {
        this.router.navigate(['seller/create'])
    }

    goToCheckOrdersStatus(): void {
        this.router.navigate(['seller/orders'])
    }
}
