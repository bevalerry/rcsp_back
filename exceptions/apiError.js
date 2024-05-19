export class ApiError extends Error {
    status
    errors

    constructor(status, message, errors) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static unauthorizedError() {
        return new ApiError(401, "Пользователь не авторизован")
    }

    static inactiveAccountError() {
        return new ApiError(402, "Пользователь не активировал учетную запись")
    }

    static inactiveSessionError() {
        return new ApiError(402, "Пользователь не аутентифицирован")
    }

    static expiredSessionError() {
        return new ApiError(403, "Сессия устарела")
    }

    static lowAuthorityError() {
        return new ApiError(405, "Нет прав доступа")
    }

    static badRequestError(message, errors = []) {
        return new ApiError(400, message, errors)
    }

    static fileRemoveError() {
        return new ApiError(500, "Непредвиденная ошибка при удалиении файла")
    }
}