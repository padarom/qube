exports.handler = function (event, context, callback) {
  if (event.httpMethod !== 'GET') {
    return callback(null, { statusCode: 410, body: 'Unsupported Request Method' })
  }

  if (!context.clientContext) {
    return callback(null, { statusCode: 401, body: 'Unauthorized' })
  }

  const {identity, user} = context.clientContext
  callback(null, { statusCode: 200, body: JSON.stringify(context) })
}
