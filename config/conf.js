const dev = {};
dev['mlab.db.url'] = "https://api.mlab.com/api/1/databases/movie/collections";
dev['mlab.db.key'] = "N45LFP8U-avNxijAJ5SIwOx_LOQPhxhT";

dev['moviedb.url'] = "http://api.themoviedb.org/3";
dev['moviedb.key'] = "e0aa8ef5230330454d715945a0db3d27";

dev['express.api.url'] = "http://localhost:3300/api";

dev['express.server.port'] = 3300;

const prod = {'user':123};
const env = {'dev': dev, 'prod': prod}

module.exports = env[process.env.NODE_ENV||NODE_ENV];
