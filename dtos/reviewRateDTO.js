export class ReviewRateDTO {
    id
    review
    value
    author

    constructor(model) {
        this.id = model._id
        this.review = model.review
        this.value = model.value
        this.author = model.author
    }
}