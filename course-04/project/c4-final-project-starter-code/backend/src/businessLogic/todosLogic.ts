import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'

const todoAccess = new TodoAccess()

export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string): Promise<TodoItem> {
    const todoId = uuid.v4()

    const item = {
        todoId: todoId,
        userId: userId,
        createdAt: new Date().toISOString(),
        done: false,
        ...newTodo
    }

    return await todoAccess.createTodo(item)
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodos(userId)
}

export async function updateTodo(
    todoId: string, userId: string,
    updatedTodo: UpdateTodoRequest,) {
    return await todoAccess.updateTodo(todoId, userId, updatedTodo)
}

export async function deleteTodo(todoId: string, userId: string) {
    return await todoAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(todoId: string, userId: string): Promise<string> {
    const imageId = uuid.v4()
    const url = todoAccess.getUploadUrl(imageId)

    await todoAccess.updateTodoWithImageUrl(todoId, userId, imageId)
    return url
}