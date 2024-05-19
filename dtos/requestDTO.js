export class RequestDTO {
    id
    author
    title
    content
    date
    status

    constructor(model, author) {
        this.id = model._id
        this.title = model.title
        this.content = model.content
        this.date = model.date
        this.status = model.status
        this.author = author
    }
}