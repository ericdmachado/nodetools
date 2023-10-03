import { spawn } from 'node:child_process'
import { log } from '../builder/index.mjs'
import chokidar from 'chokidar'
import chalk from 'chalk';

const isProduction = !!process.argv.slice(2).includes('--mode=production');

//Mantem o node ativo escutando um processo
const keepWait = spawn(process.execPath);

// Captura os parametros passado no package.json
console.info(process.argv.slice(2));

//Armazena os processos criados
const processList = [];

//Cria um novo processo no node
const startChildProcess = () => {
  const child = spawn('node', ['./app.mjs']); //arquivo onde está minha aplicação
  
  child.stderr.on('data', (data)=>log(chalk.red(data.toString().replace(/\n$/gm, '')))); //ouvinte de eventos de erro
  
  child.stdout.on('data', (data)=>log(chalk.green(data.toString().replace(/\n$/gm, '')))); //ouvinte de eventos de saída
  
  child.on('close', ()=>{ //ouvinte do evento close
    if(isProduction) keepWait.kill();
  }); 
  
  return child;
}

//Escuta as alterações realizadas no arquivo app.js
if(isProduction){
  processList.forEach(child=>child.kill()); //elimina os processos anteriores
  const child = startChildProcess(); //cria um novo processo no node
  processList.push(child); //guarda em uma lista de processos ativos
}else{
  chokidar.watch(['./app.mjs']).on('all', ()=>{
    processList.forEach(child=>child.kill()); //elimina os processos anteriores
    const child = startChildProcess(); //cria um novo processo no node
    processList.push(child); //guarda em uma lista de processos ativos
  });
}