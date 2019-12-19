import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  // Return a presigned URL to upload a file for a TODO item with the provided id
  const imageId = uuid.v4()
  const url = getUploadUrl(imageId)
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

  await docClient.update({
    TableName: todosTable,
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

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url,
      imageUrl: imageUrl
    })
  }
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: +urlExpiration
  })
}
