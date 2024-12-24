export class UserDTO {
    constructor(user) {
        this.id = user.id
        this.name = user.name
    }
}

export class DetailedUserDTO extends UserDTO {
    constructor(user) {
        super(user)

        this.email = user.email
        this.phone = user.phone
        this.role = user.role
    }
}
