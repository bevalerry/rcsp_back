export class ReviewCommentDTO {
    id
    review
    content
    author
    date

    constructor(model, author) {
        this.id = model._id
        this.review = model.review
        this.content = model.content
        this.date = model.date
        this.author = author
    }
}