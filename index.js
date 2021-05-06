const path = require('path')
const Mali = require('mali')

/*
 * NGSI
 */

var NGSI = require('ngsijs')
var connection = new NGSI.Connection("http://localhost:1026")
connection.v2.listEntities().then((response) => {
    response.results.forEach((entity) => {
        console.log(entity.id);
    })
})

const PROTO_PATH = path.resolve(__dirname, 'Open-IoT-gRPC/gRPC-IoT.proto')

let DataType = [
    "number" // 0
]

let DataUpdateModeType = [
    "auto",     // 0
    "ask",      // 1
    "interval", // 2
]

async function DeclareConfiguration(ctx) {
    var req = ctx.request.req
    try {
        var entity = { 
            id: req.id,
            type: "gRPC-Generic"
        }

        await req.configuration.dataConfiguration.forEach((data) => {
            entity[data.key] = {
                type: DataType[data.dataType],
                metadata: {
                    interval: {
                        value: data.interval,
                        type: "number"
                    },
                    updateMode: {
                        value: DataUpdateModeType[data.dataUpdateMode],
                        type: "string"
                    }
                }
            }
        })
        await connection.v2.createEntity(entity)
        ctx.res = {
            errorCode: "SUCCESS"
        }
    }catch(err){
        console.log(err)
        ctx.res = {
            errorCode: "FAILURE"
        }
    } 
}

function main() {
    const app = new Mali(PROTO_PATH)
    app.use({ DeclareConfiguration })
    app.start('127.0.0.1:50051')
}

main()
