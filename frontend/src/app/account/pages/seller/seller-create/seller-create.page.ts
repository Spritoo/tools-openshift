import { Component, OnInit } from '@angular/core'
import { OrderService } from '../../../../order/order.service'
import { Observable } from 'rxjs'
import { NgForOf, NgIf } from '@angular/common'
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
    FormsModule,
} from '@angular/forms'
import { DetailedOrder, OrderStatus } from '../../../../order/order.service'
import { CommonModule } from '@angular/common'
import { AccountService, DetailedUser } from '../../../account.service'

@Component({
    selector: 'app-seller-create',
    standalone: true,
    imports: [NgForOf, NgIf, CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './seller-create.page.html',
})
export class SellerCreateComponent implements OnInit {
    orders$!: Observable<DetailedOrder[]> // Use Observable to fetch and display data in the template
    user$!: Observable<DetailedUser>
    orderForm!: FormGroup // Form group for order form
    submissionStatus: string | null = null // Tracks submission success or failure
    errorMessage: string | null = null // Tracks error message for invalid form
    messageType: 'success' | 'error' | null = null // Tracks message type for alert
    statusOptions: OrderStatus[] = [
        'pending',
        'assigned',
        'accepted',
        'declined',
        'picked up',
        'in transit',
        'delivered',
    ]

    constructor(
        private fb: FormBuilder,
        private orderService: OrderService,
        private accountService: AccountService,
    ) {}

    ngOnInit(): void {
        // Fetch orders when the component initializes
        this.orders$ = this.orderService.getOrders()
        this.user$ = this.accountService.fetchMyUser()
        this.initializeForm()
    }

    // Initialize the form structure
    initializeForm() {
        this.orderForm = this.fb.group({
            items: this.fb.array([this.createItem()]), // Dynamic items array
            totalWeight: ['', [Validators.required, Validators.min(1)]],
            pickupLocation: this.fb.group({
                address: ['', Validators.required],
                city: ['', Validators.required],
            }),
            destination: this.fb.group({
                address: ['', Validators.required],
                city: ['', Validators.required],
            }),
            deliveryTime: [''],
            receiverPhone: [
                '',
                [Validators.required, Validators.pattern(/^\d{11}$/)],
            ],
        })
    }

    // Create a new item form group
    createItem(): FormGroup {
        return this.fb.group({
            name: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
        })
    }

    // Get the items FormArray from the form
    get items(): FormArray {
        return this.orderForm.get('items') as FormArray
    }

    // Add a new item form group to the items array
    addItem() {
        this.items.push(this.createItem())
    }

    // Remove an item form group from the items array
    removeItem(index: number) {
        this.items.removeAt(index)
    }

    createOrder(): void {
        if (this.orderForm.valid) {
            const orderData: DetailedOrder = this.orderForm.value

            // Check and set default value if deliveryTime is empty
            if (!orderData.deliveryTime) {
                orderData.deliveryTime = new Date().toISOString() // Default to current date/time
            }

            this.orderService.addOrder(orderData).subscribe(() => {
                // Optionally, reload orders or perform any other action after the order is created
                this.submissionStatus = 'Order created successfully!'
                this.errorMessage = null // Clear any previous errors
                this.messageType = 'success'
                this.hideMessageAfterDelay()
                this.orders$ = this.orderService.getOrders()
                this.orderForm.reset() // Optionally reset form after submission
                this.initializeForm() // Reinitialize form to start fresh
            })
        } else {
            this.submissionStatus = null
            this.errorMessage = 'Please fill out the form correctly.'
            this.messageType = 'error'
            this.hideMessageAfterDelay()
            console.error('Form is invalid')
        }
    }

    // Hide the message after 3 seconds or on form interaction
    hideMessageAfterDelay() {
        setTimeout(() => {
            this.submissionStatus = null
            this.errorMessage = null
            this.messageType = null
        }, 3000)
    }

    hideMessageOnInteraction(event?: KeyboardEvent): void {
        // You can add logic to check the key pressed if needed, but for now,
        // we just hide the message when any interaction occurs (click or keydown).
        this.submissionStatus = null
        this.errorMessage = null
        this.messageType = null
    }
}
