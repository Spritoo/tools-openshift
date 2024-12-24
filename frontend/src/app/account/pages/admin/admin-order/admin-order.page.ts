import { Component, OnInit } from '@angular/core'
import { OrderService } from '../../../../order/order.service'
import { Observable } from 'rxjs'
import { NgForOf, NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DetailedOrder, OrderStatus } from '../../../../order/order.service'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-admin-order',
    standalone: true,
    imports: [NgForOf, NgIf, FormsModule, CommonModule],
    templateUrl: './admin-order.page.html',
})
export class AdminOrderComponent implements OnInit {
    orders$!: Observable<DetailedOrder[]> // Use Observable to fetch and display data in the template
    statusOptions: OrderStatus[] = [
        'pending',
        'assigned',
        'accepted',
        'declined',
        'picked up',
        'in transit',
        'delivered',
    ]

    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        // Fetch orders when the component initializes
        this.orders$ = this.orderService.getOrders()
    }

    updateOrderStatus(id: string, status: OrderStatus): void {
        // Call the service to update order status
        this.orderService.updateOrderStatus(id, status).subscribe(() => {
            // Reload the orders list or update the specific order locally if needed
            this.orders$ = this.orderService.getOrders()
        })
    }

    deleteOrder(id: string): void {
        // You’ll need to add a delete method in the OrderService
        this.orderService.deleteOrder(id).subscribe(() => {
            // Reload the orders list after deletion
            this.orders$ = this.orderService.getOrders()
        })
    }
}
