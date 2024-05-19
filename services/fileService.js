import { v4 } from "uuid"
import { resolve } from 'path'
import { existsSync, unlink } from "fs"
import { ApiError } from "../exceptions/apiError.js"

class FileService {
    saveFile(file) {
        try {
            const fileName = v4() + '.' + file.mimetype.split('/')[1]
            const filePath = resolve('static', fileName)
            file.mv(filePath)
            return fileName
        } catch(e) {
            console.log(e)
        }
    }

    removeFile(fileName) {
        if (fileName) {
            const filePath = resolve('static', fileName)
            if (existsSync(filePath)) {
                try {
                    
                    unlink(filePath, (err) => {
                        if (err) {
                            throw ApiError.fileRemoveError()
                        }
                        console.log("Файл успешно удален")
                    })
                } catch(e) {
                    console.log(e)
                }
            
            }
        }
    }
}

export const fileService = new FileService()