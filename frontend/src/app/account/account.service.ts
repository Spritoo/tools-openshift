import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, map, tap } from 'rxjs'

interface AuthResponse {
    token: string
    user: DetailedUser
}

export interface User {
    id: string
    name: string
}

export interface DetailedUser extends User {
    email: string
    phone: string
    role: string
}

export interface CompleteUser extends Omit<DetailedUser, 'id'> {
    password: string
}

@Injectable({ providedIn: 'root' })
export class AccountService {
    private static TOKEN_KEY = 'token'

    private isAuthenticatedSubject: BehaviorSubject<boolean>
    private userSubject: BehaviorSubject<DetailedUser | null>

    constructor(
        private router: Router,
        private http: HttpClient,
    ) {
        this.isAuthenticatedSubject = new BehaviorSubject(Boolean(this.token)) // todo: check token expiry
        this.userSubject = new BehaviorSubject<DetailedUser | null>(null)
    }

    public get isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value
    }

    public get user(): DetailedUser | null {
        return this.userSubject.value
    }

    public get getUserRole(): string | null {
        return this.user?.role ?? null
    }

    public get token(): string | null {
        return localStorage.getItem(AccountService.TOKEN_KEY)
    }

    private set token(token: string) {
        localStorage.setItem(AccountService.TOKEN_KEY, token)
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponse>('/api/auth/login', { email, password })
            .pipe(
                map((response) => {
                    this.token = response.token

                    this.isAuthenticatedSubject.next(true)
                    this.userSubject.next(response.user)

                    return response.user
                }),
            )
    }

    register(user: CompleteUser) {
        return this.http.post<AuthResponse>('/api/auth/register', user).pipe(
            map((response) => {
                this.token = response.token

                this.isAuthenticatedSubject.next(true)
                this.userSubject.next(response.user)

                return response.user
            }),
        )
    }

    logout(redirect = true) {
        localStorage.removeItem(AccountService.TOKEN_KEY)

        this.isAuthenticatedSubject.next(false)
        this.userSubject.next(null)

        if (redirect) {
            this.navigateToLogin()
        }
    }

    fetchMyUser() {
        return this.http.get<DetailedUser>('/api/users/@me').pipe(
            tap((user) => {
                this.userSubject.next(user)
            }),
        )
    }

    navigateToLogin() {
        this.router.navigate(['login'])
    }
}
