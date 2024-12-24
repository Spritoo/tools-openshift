import { CommonModule, DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { OrderService, DetailedOrder } from '../../../order/order.service'
import { UserService, nameAndPhone } from '../../../user/user.service'

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [DatePipe, CommonModule], // Add DatePipe to imports here
    templateUrl: './order-details.page.html',
})
export class OrderDetailsComponent implements OnInit {
    orderId!: string // To store the order ID
    orderDetails!: DetailedOrder // To store the order details
    driver!: nameAndPhone // To store the driver details
    driverPhone!: string // To store the driver's phone number
    errorMessage: string | null = null // To store any error message

    constructor(
        private route: ActivatedRoute,
        private orderService: OrderService,
        private router: Router,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.orderId = params['id'] // Get order ID from the URL
            this.getOrderDetails() // Fetch order details
        })
    }

    getOrderDetails(): void {
        this.orderService
            .getOrderByIdForUser(this.orderId)
            .subscribe((order) => {
                this.orderDetails = order // Set the order details
                this.getDriverDetails() // Now fetch driver details after order is fetched
            })
    }

    getDriverDetails(): void {
        if (this.orderDetails.driverId) {
            this.userService
                .getDriverById(this.orderDetails.driverId)
                .subscribe((driver) => {
                    this.driver = driver
                })
        }
    }

    async goBack(): Promise<void> {
        // Wait for any async task to complete
        await this.someAsyncTask()

        // Navigate after the task completes
        this.router.navigate(['/seller/orders'])
    }

    async someAsyncTask(): Promise<void> {
        // Replace this with any async task you need to complete before navigating
        return new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating async task
    }

    cancelOrder(): void {
        this.orderService.cancelOrderByIdForUser(this.orderId).subscribe(() => {
            // Only navigate if the cancellation was successful
            if (this.orderDetails.status === 'pending')
                this.router.navigate(['/seller/orders'])
            else {
                this.errorMessage = "Can't cancel an order that is not pending."
                setTimeout(() => {
                    this.errorMessage = null
                }, 3000) // Hide the error message after 3 seconds
            }
        })
    }
}
