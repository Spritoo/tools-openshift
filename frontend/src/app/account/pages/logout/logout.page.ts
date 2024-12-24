import { Component, OnInit } from '@angular/core'
import { AccountService } from '../../account.service'
import { Router } from '@angular/router'

@Component({ template: '' })
export class LogoutComponent implements OnInit {
    constructor(
        private accountService: AccountService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.accountService.logout(false)
        this.router.navigate(['/'])
    }
}
