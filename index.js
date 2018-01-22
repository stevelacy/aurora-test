const Sequelize = require('sequelize')
const QueryTypes = Sequelize.QueryTypes
const uuid = require('uuid/v4')

const database = process.env.DATABASE
const user = process.env.USER
const options = {
  dialect: 'postgres',
  native: false,
  typeValidation: true,
  port: 5432,
  database,
  user,
  logging: false,
  pool: {
    max: 100,
    min: 1,
    acquire: 60000,
    idle: 4000,
    evict: 4000
  },
  replication: {
    write: process.env.POSTGRES_URL || 'postgres://localhost:5432/' + database,
    read: process.env.POSTGRES_REPLICAS || 'postgres://localhost:5432/' + database
  }
}

const connection = new Sequelize(options)

connection.authenticate()
  .then(() => connection.databaseVersion())
  .then((ver) => {
    const { replication } = connection.options
    console.log(replication, ver)
    return null
  })
  .catch((e) => console.error(e))


const querys = [
  `SELECT "source"."id", "dataType"."id" AS "dataType.id", "dataType"."userId" AS "dataType.userId","dataType"."createdAt" AS "dataType.createdAt", "dataType"."updatedAt" AS "dataType.updatedAt", "dataType"."official" AS "dataType.official", "dataType"."name" AS "dataType.name", "dataType"."notes" AS "dataType.notes", "dataType"."schema" AS "dataType.schema" FROM "sources" AS "source" INNER JOIN "dataTypes" AS "dataType" ON "source"."dataTypeId" = "dataType"."id" WHERE "source"."apiKey" = 'eeddf1eb-8167-4d0d-83c7-4c7c00ad5d2f' LIMIT 1`,
  `INSERT INTO "data" ("id","sourceId","createdAt","updatedAt","geometry","data")
  VALUES ($id,$pid,NOW(),NOW(),ST_GeomFromGeoJSON($geometry)::geography,$data)
  ON CONFLICT ("id") DO UPDATE SET "updatedAt"=NOW(),"geometry"=ST_GeomFromGeoJSON($geometry)::geography,"data"=$data RETURNING *;`

]


const data = {"id":"152098041","receivedAt":"2015-07-28T00:00:00.000Z","type":"01A","notes":"abandoned vehicle - INT PARK RIDE","location":{"type":"Point","coordinates":[-84.414581,33.769805],"properties":{"short":"Atlanta","full":"Atlanta, GA, USA","city":"Atlanta","county":"Fulton County","region":"Georgia","country":"United States"}},"disposition":10}

const geometry = {
  type: 'Point',
  coordinates: [ -84.414581, 33.769805 ],
  properties:
   { short: 'Atlanta',
     full: 'Atlanta, GA, USA',
     city: 'Atlanta',
     county: 'Fulton County',
     region: 'Georgia',
     country: 'United States'
   }
}

let count = 0
async function createQueries() {
  const select = await connection.query(querys[0])
  const item = await connection.query(querys[1], {
    type: QueryTypes.SELECT,
    bind: {
      id: uuid(),
      data,
      geometry: JSON.stringify(geometry),
      pid: '8bb3fe61-3f7a-480e-8817-efe73a1bcb22'
    },
    useMaster: true
  })
  console.log('fired', ++count, 'events')
}

function init() {
  createQueries()
  if (count >= 100) return
  setInterval(init, 100)
}

init()