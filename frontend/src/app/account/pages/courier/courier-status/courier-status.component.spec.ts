import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CourierStatusComponent } from './courier-status.page'

describe('CourierStatusComponent', () => {
    let component: CourierStatusComponent
    let fixture: ComponentFixture<CourierStatusComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CourierStatusComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CourierStatusComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
