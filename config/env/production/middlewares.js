module.exports = {
  load: {
    before: ["timer", "responseTime", "logger", "cors", "responses", "gzip"],
    order: [],
    after: ["parser", "router"],
  },
  settings: {
    timer: {
      enabled: true,
    },
    cors: {
      enabled: true,
      origin: [
        "http://localhost",
        "https://tu-voto-web-jeac.vercel.app",
        "http://12.23.45.67:1234",
      ],
    },
  },
};
