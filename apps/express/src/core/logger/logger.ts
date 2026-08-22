type LogLevel = "debug" | "info" | "warn" | "error";

type LogFields = Record<string, unknown>;

function write(level: LogLevel, message: string, fields?: LogFields): void {
  const entry = JSON.stringify({ level, time: new Date().toISOString(), message, ...fields });

  if (level === "error") {
    console.error(entry);
  } else if (level === "warn") {
    console.warn(entry);
  } else {
    console.log(entry);
  }
}

export const logger = {
  debug: (message: string, fields?: LogFields) => write("debug", message, fields),
  info: (message: string, fields?: LogFields) => write("info", message, fields),
  warn: (message: string, fields?: LogFields) => write("warn", message, fields),
  error: (message: string, fields?: LogFields) => write("error", message, fields),
};
