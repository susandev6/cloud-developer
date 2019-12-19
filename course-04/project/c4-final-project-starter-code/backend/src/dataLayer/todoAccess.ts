import * as AWS from 'aws-sdk'
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIndex = process.env.USER_ID_INDEX,
        private readonly s3 = new AWS.S3({
            signatureVersion: 'v4'
        }),
        private readonly bucketName = process.env.S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {}

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async updateTodo(todoId: string, userId: string, todoUpdate: TodoUpdate) {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
              todoId: todoId,
              userId: userId
            },
            UpdateExpression: "set #n = :a, dueDate = :b, done = :c",
            ExpressionAttributeValues: {
              ":a": todoUpdate.name,
              ":b": todoUpdate.dueDate,
              ":c": todoUpdate.done
            },
            ExpressionAttributeNames: {
              "#n": "name"
            },
            ReturnValues: "UPDATED_NEW"
          }).promise()
    }

    async deleteTodo(todoId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
              userId: userId,
              todoId: todoId
            }
        }).promise()
    }

    getUploadUrl(imageId: string) {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: +this.urlExpiration
        })
    }

    async updateTodoWithImageUrl(todoId: string, userId: string, imageId: string) {
        const imageUrl = `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
        
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
              todoId: todoId,
              userId: userId
            },
            UpdateExpression: "set attachmentUrl = :a",
            ExpressionAttributeValues:{
              ":a": imageUrl
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
    }
}
