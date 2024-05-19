export class ReviewDTO {
    id
    category
    categoryId
    author
    title
    content
    reliability
    usersRatedAmount
    date
    pictureName

    constructor(model, author, categoryName) {
        this.id = model._id
        this.category = categoryName
        this.categoryId = model.category
        this.title = model.title
        this.content = model.content
        this.reliability = model.reliability
        this.usersRatedAmount = model.usersRatedAmount
        this.date = model.date
        this.pictureName = model.pictureName
        this.author = author
    }
}