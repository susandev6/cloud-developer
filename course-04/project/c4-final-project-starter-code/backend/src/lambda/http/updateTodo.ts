import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { getUserId } from '../utils'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  await docClient.update({
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: userId
    },
    UpdateExpression: "set #n = :a, dueDate = :b, done = :c",
    ExpressionAttributeValues: {
      ":a": updatedTodo.name,
      ":b": updatedTodo.dueDate,
      ":c": updatedTodo.done
    },
    ExpressionAttributeNames: {
      "#n": "name"
    },
    ReturnValues: "UPDATED_NEW"
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
