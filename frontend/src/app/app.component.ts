import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NavbarComponent } from './ui/components/navbar/navbar.component'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NavbarComponent, RouterOutlet],
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'frontend'
}
