import { exec, spawn } from 'node:child_process'
import YAML from 'yaml'
import fs from 'fs'

exec('mkdir dist');

const log = (...args) => {
  console.info(...args.map(sanitize));
}

const sanitize = ( data ) => {
  return data
  .replace(/\n$/gm, '')
  .replace(/^\s/gm, '')
  .replace(/\s{2,}/gm, ' ');
}

const execDockerCommand = () => {
  const child = spawn('docker',['compose', '-f', './dist/docker-compose.yml', 'up', '-d', '--force-recreate', '--build']);
  child.stderr.on('data', (data)=>log(data.toString()));
  child.stdout.on('data', async (data)=>log(data.toString()));
  child.on('close', ()=>{});
}

fs.readFile('./applications/web/container.json', (err, data)=>{
  if(err) throw err;
  
  const ymlFile = YAML.stringify(JSON.parse(data.toString()));
  
  fs.writeFile('./dist/docker-compose.yml', ymlFile, (err)=>{
    if(err) throw err;
    console.info('docker-compose.yml has been created!');
    execDockerCommand();
  });
});