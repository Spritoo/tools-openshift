import winston from 'winston'

export default winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.colorize(),
                winston.format.printf(({ level, message, stack }) => {
                    return stack
                        ? `${level}: ${message}\n${stack}`
                        : `${level}: ${message}`
                }),
            ),
        }),
    ],
})
