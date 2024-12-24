import { Component, OnInit } from '@angular/core'
import { OrderService, DetailedOrder } from '../../../../order/order.service'
import { Observable } from 'rxjs'
import { NgForOf, NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AccountService, DetailedUser } from '../../../account.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-seller-order',
    standalone: true,
    imports: [NgForOf, NgIf, FormsModule, CommonModule],
    templateUrl: './seller-order.page.html',
})
export class SellerOrderComponent implements OnInit {
    orders$!: Observable<DetailedOrder[]>
    user$!: Observable<DetailedUser>

    constructor(
        private router: Router,
        private orderService: OrderService,
        private accountService: AccountService,
    ) {}

    ngOnInit(): void {
        // Fetch orders when the component initializes
        this.orders$ = this.orderService.getUserOrders()
        this.user$ = this.accountService.fetchMyUser()
    }

    displayMyOrders(): void {
        this.orders$ = this.orderService.getUserOrders()
    }

    viewOrderDetails(orderId: string): void {
        this.router.navigate(['/order-details', orderId]) // Navigate to OrderDetailsComponent with the order ID
    }
}
