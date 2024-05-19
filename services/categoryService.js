import { CategoryDTO } from "../dtos/categoryDTO.js"
import { UserDTO } from "../dtos/userDTO.js"
import { ApiError } from "../exceptions/apiError.js"
import { categoryModel } from "../models/categoryModel.js"
import { userModel } from "../models/userModel.js"
import { fileService } from "./fileService.js"

class CategoryService {
    async create(title, picture, request, author) {
        const checkIfExists = await categoryModel.findOne({ title })
        if (checkIfExists) {
            throw ApiError.badRequestError(`Категория: ${title} уже существует!`)
        }
        const pictureName = fileService.saveFile(picture)
        const category = await categoryModel.create({ title, pictureName, request, author })
        const relatedAuthor = await userModel.findOne(category.author)
        const categoryData = new CategoryDTO(category, new UserDTO(relatedAuthor))
        return categoryData
    }

    async getAll() {
        const categories = Promise.all((await categoryModel.find())
            .map(async model => {
                const author = await userModel.findOne(model.author)
                return new CategoryDTO(model, new UserDTO(author))
            }
        ))
        return categories
    }

    async getOne(id) {
        const category = await categoryModel.findOne({ id })
        const author = await userModel.findOne(category.author)
        const categoryData = new CategoryDTO(category, new UserDTO(author))
        return categoryData
    }

    async update(id, title, picture) {
        const category = await categoryModel.findOne({ _id: id })
        if (title) {
            category.title = title
        }
        if (picture) {
            fileService.removeFile(category.pictureName)
            category.pictureName = fileService.saveFile(picture)
        }
        const updatedCategory = await category.save()
        const author = await userModel.findOne(category.author)
        const categoryData = new CategoryDTO(updatedCategory, new UserDTO(author))
        return categoryData
    }

    async remove(id) {
        const deletedCategory = await categoryModel.findOne({ _id: id })
        await categoryModel.deleteOne({ _id: id })
        const author = await userModel.findOne(deletedCategory.author)
        const deletedCategoryData = new CategoryDTO(deletedCategory, new UserDTO(author))
        fileService.removeFile(deletedCategoryData.pictureName)
        return deletedCategoryData
    }
}

export const categoryService = new CategoryService()