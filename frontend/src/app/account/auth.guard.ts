import { inject, Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    Router,
    RouterStateSnapshot,
} from '@angular/router'
import { AccountService } from './account.service'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private accountService = inject(AccountService)

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): MaybeAsync<GuardResult> {
        if (this.accountService.isAuthenticated) return true

        this.accountService.navigateToLogin()

        return false
    }
}

@Injectable({ providedIn: 'root' })
export class GuestOnlyGuard implements CanActivate {
    private accountService = inject(AccountService)
    private router = inject(Router)

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): MaybeAsync<GuardResult> {
        if (!this.accountService.isAuthenticated) return true

        this.router.navigate(['/'])

        return false
    }
}
