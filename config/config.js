module.exports = config = {
  "name" : "Analytics",

  "tracking_port" : 8000,
  "dashboard_port" : 8080,

  "mongo_host" : "localhost",
  "mongo_port" : 27017,

  "udp_address" : "0.0.0.0",
  "udp_port" : 8000,

  "enable_dashboard" : true,

  "capistrano" : {
    "repository" :       "git@github.com:tatemae/CaPRet.git",
    "hummingbird_host" : "stats.oerglue.com"
  }
}
