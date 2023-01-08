import http, { IncomingMessage, Server, ServerResponse } from "http";
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
/*
implement your server code here
*/

let file = fs.readFileSync('/Users/decagon/Week5/week-5-task-Onyinye-Reca/server/server/database.json', 'utf-8')
if( !file) {
 file = []
}
file = JSON.parse(file)
const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
interface fileInfo {
    organization:string,
    createdAt: string,
    updatedAt: string,
    products: string[],
    marketValue: string,
    address: string,
    ceo: string,
    country: string,
    id: number,
    noOfEmployees:number,
    employees:string[]
}

    if (req.method === "GET") {
      res.writeHead(200,{'Content-Type': 'application/json'})
      console.log(file);
      res.end(JSON.stringify(file));
    }

    if(req.method === "POST"){
      req.on('data', data => {
        let jsondata = JSON.parse(data)
        jsondata.createdAt = new Date()
        const organization = jsondata.organization;
        if(organization) {
          let id = file.length === 0 ? 1 : file[file.length-1].id + 1;
          jsondata.id = id
          file.push(jsondata)
          
          fs.writeFile('/Users/decagon/Week5/week-5-task-Onyinye-Reca/server/server/database.json', JSON.stringify(file), (err:{}) => {
            if (err) {
              const message = { message: 'could not persist data!' };
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.end(JSON.stringify(message, null, 2));
            } else {
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end(JSON.stringify(file, null, 2));
            }
          });
        
        }
      })
    }
    if(req.method === "PUT") {
      req.on('data',data => {
       let bodyParse = JSON.parse(data);
      bodyParse.updatedAt = new Date();
       const id = bodyParse.id
        file.forEach((value:fileInfo, index:number) => {
          if(value.id === id){
            file[index] = bodyParse
          }
        });
        console.log(file);
        res.end(JSON.stringify(file))
   })
  
  }
  if(req.method === "DELETE") {
    req.on("data", data => {
    let bodyParse = JSON.parse(data);
      const id = bodyParse.id
      console.log(typeof id);
      console.log(file);
       let filteredFile = file.filter((value:fileInfo, index:number) => value.id !== id);
      console.log(filteredFile);
      fs.writeFile('/Users/decagon/Week5/week-5-task-Onyinye-Reca/server/server/database.json', JSON.stringify(filteredFile),(err:{}) => {
        if (err) {
          const message = { message: 'could not persist data!' };
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(filteredFile));
        } else {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(file, null, 2));
        }
      })
    })

  
  }
})

server.listen(3005);
