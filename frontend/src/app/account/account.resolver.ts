import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    MaybeAsync,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router'
import { AccountService, DetailedUser } from './account.service'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AccountResolver implements Resolve<DetailedUser | null> {
    constructor(private accountService: AccountService) {}

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): MaybeAsync<DetailedUser | null> {
        if (!this.accountService.isAuthenticated) {
            return new Observable<null>((observer) => {
                observer.next(null)
                observer.complete()
            })
        }

        return this.accountService.fetchMyUser()
    }
}
