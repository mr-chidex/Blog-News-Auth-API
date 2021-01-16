const { createLogger, transports, format } = require("winston");
// require("winston-mongodb")

const logger = createLogger({
    transports: [
        new transports.File({
            filename: "info.log",
            level: "info",
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.Console({
            level: "info",
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.File({
            filename: "error.log",
            level: "error",
            format: format.combine(format.timestamp(), format.json()),
        }),
        // new transports.MongoDB({
        //     level: "error",
        //     db: process.env.DB,
        //     collection: "errorLog",
        //     options: { useUnifiedTopology: true }
        // })
    ]
})

module.exports = logger;