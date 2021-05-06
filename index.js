const path = require('path')
const Mali = require('mali')

const PROTO_PATH = path.resolve(__dirname, 'Open-IoT-gRPC/gRPC-IoT.proto')

async function DeclareConfiguration (ctx) {
    console.log(ctx.request.req)
  ctx.res = { errorCode: "SUCCESS" }
}

function main () {
  const app = new Mali(PROTO_PATH)
  app.use({ DeclareConfiguration })
  app.start('127.0.0.1:50051')
}

main()
