import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http'
import { catchError, Observable, throwError } from 'rxjs'
import { AccountService } from '../account/account.service'
import { inject } from '@angular/core'

// single responsibility is violated by this interceptor
// maybe split this up into multiple interceptors (api/base url & auth header & error handler)

export function apiInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
    const accountService = inject(AccountService)
    const authorization =
        accountService.token !== null ? `Bearer ${accountService.token}` : ''

    const newRequest = req.clone({
        url: `${import.meta.env.NG_APP_API_URL}${req.url}`,
        headers: req.headers.set('Authorization', authorization),
    })

    return next(newRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                accountService.logout()
            }

            return throwError(() => error)
        }),
    )
}
