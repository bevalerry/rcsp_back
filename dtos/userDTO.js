export class UserDTO {
    email
    nickname
    id
    isActivated
    role

    constructor(model) {
        this.email = model.email
        this.id = model._id
        this.isActivated = model.isActivated
        this.role = model.role
        this.nickname = model.nickname
    }
}