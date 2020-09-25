
export class Logger {

  private static logEnabled(category): boolean {
    return process.env["LOG_" + category] === 'true';
  }

  public static log(category: string, logString: string) {
    if (this.logEnabled(category)) {
      console.log(`[${category}]::${logString}`);
    }
  }
}