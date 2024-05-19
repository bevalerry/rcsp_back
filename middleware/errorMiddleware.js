import { ApiError } from '../exceptions/apiError.js'

function messageBounder(message) {
    return (
`---------------------------------------------------------------------------
${message}
---------------------------------------------------------------------------`
)}

export function errorMiddleware(err, req, res, next) {
    console.log(messageBounder(err.message))
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors })
    }
    return res.status(500).json({ message: "Непредвиденная ошибка на сервере" })
}