import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AccountService } from '../account/account.service'
import { BehaviorSubject, Observable, of, EMPTY } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

export type UserRole = 'seller' | 'driver' | 'admin'

export interface User {
    id: string
    name: string
}

export interface UserDetails extends User {
    role: UserRole
}

export interface nameAndPhone extends UserDetails {
    phone: string
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    // Changed class name to be more consistent with Angular services
    private usersSubject = new BehaviorSubject<UserDetails[]>([])
    users$ = this.usersSubject.asObservable()

    constructor(
        private router: Router,
        private http: HttpClient,
        private accountService: AccountService,
    ) {}

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.accountService.token}`,
        })
    }

    getAllDrivers(): Observable<UserDetails[]> {
        return this.http
            .get<UserDetails[]>('/api/admin/drivers', {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                tap((users) => this.usersSubject.next(users)),
                catchError((error) => {
                    console.error('Error fetching drivers', error)
                    return EMPTY
                }),
            )
    }

    getAllDriversForDriver(): Observable<UserDetails[]> {
        return this.http
            .get<UserDetails[]>('/api/courier/drivers', {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                tap((users) => this.usersSubject.next(users)),
                catchError((error) => {
                    console.error('Error fetching drivers', error)
                    return EMPTY
                }),
            )
    }

    getDriverById(id: string): Observable<nameAndPhone> {
        return this.http
            .get<nameAndPhone>(`/api/users/driver/${id}`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error(
                        `Error fetching driver for order with ID ${id}`,
                        error,
                    )
                    return of(null as unknown as nameAndPhone)
                }),
            )
    }

    //I want to get the driver name by id

    getUserDetails(): Observable<UserDetails> {
        return this.http
            .get<UserDetails>(`/api/user/@me`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error('Error fetching user details', error)
                    return EMPTY
                }),
            )
    }
}
