import axios from "axios"
import qs from "qs"

const client_id = "b4445e9a-c1ac-4722-8eac-78c989762552"
const client_secret = "AZkmYUvOV9PgDA5W9C1NBL9YvnR0mWNl"

const instance = axios.create({
  baseURL: "https://services.sentinel-hub.com"
})

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}

const body = qs.stringify({
  client_id,
  client_secret,
  grant_type: "client_credentials"
})


// All requests using this instance will have an access token automatically added
instance.post("/auth/realms/main/protocol/openid-connect/token", body, config).then(resp => {
  Object.assign(instance.defaults, {headers: {authorization: `Bearer ${resp.data.access_token}`}})
  console.log(`Bearer ${resp.data.access_token}`)
})