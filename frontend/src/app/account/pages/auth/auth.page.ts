import { NgFor, NgIf } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { AccountService } from '../../account.service'
import { first } from 'rxjs'
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'

type FormName = 'login' | 'register'

interface AuthError {
    msg: string
    path?: string
}

@Component({
    selector: 'app-login',
    templateUrl: './auth.page.html',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, NgFor],
})
export class AuthComponent {
    private static ERROR_MESSAGES: Record<string, string> = {
        email_required: 'Email is required',
        email_email: 'Invalid email format',
        password_required: 'Password is required',
        name_required: 'Name is required',
        phone_required: 'Phone number is required',
    }

    private accountService = inject(AccountService)
    private router = inject(Router)

    forms: Record<FormName, FormGroup> = {
        login: new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
        }),
        register: new FormGroup({
            name: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            phone: new FormControl('', [Validators.required]), // todo: add proper phone number validator
            password: new FormControl('', Validators.required),
            role: new FormControl('seller'),
        }),
    }

    errors: Record<FormName, string[]> = { login: [], register: [] }

    onSubmitLogin(): void {
        const form = this.forms.login

        this.updateErrors('login')

        if (!form.valid) return

        this.accountService
            .login(form.value.email, form.value.password)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['dashboard'])
                },
                error: (err: HttpErrorResponse) => {
                    const errors = err.error?.errors as AuthError[] | null
                    const messages = errors?.map((err) => err.msg) || [
                        'An unknown error occurred. Please try again later.',
                    ]

                    this.errors.login = messages
                },
            })
    }

    onSubmitRegister(): void {
        const form = this.forms.register

        this.updateErrors('register')

        if (!this.forms.register.valid) return

        this.accountService
            .register({
                name: form.value.name,
                email: form.value.email,
                phone: form.value.phone,
                password: form.value.password,
                role: 'seller',
            })
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['dashboard'])
                },
                error: (err: HttpErrorResponse) => {
                    const errors = err.error?.errors as AuthError[] | null
                    const messages = errors?.map((err) => err.msg) || [
                        'An unknown error occurred. Please try again later.',
                    ]

                    this.errors.register = messages
                },
            })
    }

    private updateErrors(formName: FormName) {
        const form = this.forms[formName]
        const errors = []

        for (const controlName in form.controls) {
            const controlErrors = form.get(controlName)?.errors

            if (controlErrors) {
                const errorMessages = Object.keys(controlErrors).map(
                    (errCode) =>
                        AuthComponent.ERROR_MESSAGES[
                            `${controlName}_${errCode}`
                        ],
                )

                errors.push(...errorMessages)
            }
        }

        this.errors[formName] = errors
    }
}
