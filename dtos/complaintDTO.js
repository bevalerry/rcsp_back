export class ComplaintDTO {
    id
    author
    target
    review
    reviewId
    content
    status
    date

    constructor(model, author, target, review, reviewId) {
        this.id = model._id
        this.content = model.content
        this.date = model.date
        this.status = model.status
        this.reviewId = model.review
        this.author = author
        this.target = target
        this.review = review
    }
}