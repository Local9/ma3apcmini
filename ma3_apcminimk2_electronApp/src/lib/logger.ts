import chalk from "chalk";

export default class Logger {
  static success(message) {
    console.log(chalk.green(`[MESSAGE] ${message}`));
  }

  static log(message) {
    console.log(chalk.white(`[LOG] ${message}`));
  }

  static debug(message) {
    console.debug(chalk.grey(`[DEBUG] ${message}`));
  }

  static error(message) {
    console.error(chalk.red(`[ERROR] ${message}`));
  }

  static warn(message) {
    console.warn(chalk.yellow(`[WARN] ${message}`));
  }

  static info(message) {
    console.info(chalk.blue(`[INFO] ${message}`));
  }
}
