module.exports = config = {
  "name" : "Capret",

  "tracking_port" : 8000,
  "dashboard_port" : 80,

  "mongo_host" : "localhost",
  "mongo_port" : 27017,

  "udp_address" : "0.0.0.0",
  "udp_port" : 8000,

  "enable_dashboard" : true,

  "capistrano" : {
    "repository" :       "git@github.com:tatemae/capret.git",
    "hummingbird_host" : "ec2-184-73-107-100.compute-1.amazonaws.com"
  }
}
