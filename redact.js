class RedactBase {
    constructor(options = {}) {
        this.redactPatterns = [
            { 
                regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, 
                replacement: '[REDACTED_EMAIL]' 
            },
            { 
                regex: /\+?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g, 
                replacement: '[REDACTED_PHONE]' 
            },
        ];

        if (options.customPatterns) {
            this.redactPatterns.push(...options.customPatterns);
        }

        this.fileLogging = options.fileLogging || false;
        this.fs = this.fileLogging ? require('fs') : null;
        this.logFile = options.logFile || 'safe-logs.txt';
    }

    redact(message) {
        let redacted = message;
        this.redactPatterns.forEach(({ regex, replacement }) => {
            redacted = redacted.replace(regex, replacement);
        });
        return redacted;
    }

    log(message) {
        const output = this.redact(message);
        console.log(output);

        if (this.fileLogging && this.fs) {
            this.fs.appendFileSync(this.logFile, output + '\n');
        }
    }

    info(message) { this.log(`[INFO] ${message}`); }
    warn(message) { this.log(`[WARN] ${message}`); }
    error(message) { this.log(`[ERROR] ${message}`); }
}

module.exports = { RedactBase };
