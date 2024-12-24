import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SellerCreateComponent } from './seller-create.page'

describe('SellerCreateComponent', () => {
    let component: SellerCreateComponent
    let fixture: ComponentFixture<SellerCreateComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SellerCreateComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(SellerCreateComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
