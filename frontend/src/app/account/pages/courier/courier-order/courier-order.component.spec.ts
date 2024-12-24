import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CourierOrderComponent } from './courier-order.page'

describe('CourierOrderComponent', () => {
    let component: CourierOrderComponent
    let fixture: ComponentFixture<CourierOrderComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CourierOrderComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CourierOrderComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
