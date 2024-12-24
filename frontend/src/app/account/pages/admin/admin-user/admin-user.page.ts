import { Component, OnInit } from '@angular/core'
import { DetailedOrder, OrderService } from '../../../../order/order.service'
import { UserService, UserDetails } from '../../../../user/user.service'
import { Observable } from 'rxjs'
import { CommonModule } from '@angular/common'
import { NgForOf, NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-admin-user',
    standalone: true,
    imports: [NgForOf, NgIf, FormsModule, CommonModule],
    templateUrl: './admin-user.page.html',
})
export class AdminUserComponent {
    drivers$!: Observable<UserDetails[]>
    assignedOrders$!: Observable<DetailedOrder[]>
    selectedDriverId = ''

    constructor(
        private orderService: OrderService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        // Fetch drivers and assigned orders
        this.drivers$ = this.userService.getAllDrivers()
        this.assignedOrders$ = this.orderService.getOrders()
    }

    reassignOrder(orderId: string, newDriverId: string): void {
        this.orderService
            .updateOrderDriver(orderId, newDriverId)
            .subscribe(() => {
                // Refresh the list of assigned orders if needed
                this.assignedOrders$ = this.orderService.getOrders()
            })
    }
}
