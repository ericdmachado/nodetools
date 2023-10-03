import chalk from "chalk"

//Função para capturar os logs e padronizar a formatação
export const log = ( ...args ) => {
  console.info(chalk.cyan('[ builder ]'), ...args);
}