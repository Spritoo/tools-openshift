import { Component, inject } from '@angular/core'
import { AccountService } from '../../../account/account.service'
import { NgIf } from '@angular/common'

@Component({
    selector: 'app-home-navbar',
    standalone: true,
    imports: [NgIf],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    accountService = inject(AccountService)
}
