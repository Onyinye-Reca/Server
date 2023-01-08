import http, { IncomingMessage, Server, ServerResponse } from "http";
const request =require ('request')
const cheerio = require ('cheerio')
/*
implement your server code here
*/

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/post" && req.method === "POST") {
      req.on("data", (data: string) => {
        let parseData = JSON.parse(data)
        request(parseData.url, function (error:{}, response:{}, responseHtml:{}) {
          interface Object {
            title ? : string;
            description ? : string;
            images ? : string[]
          }

          let resObj:Object = {}

          if (error) {
            res.end(JSON.stringify({error: 'There was an error of some kind'}));
            return;
        }
          const $ = cheerio.load(responseHtml)
          let newTitle = $('head title').text()
          let newDesc = $('meta[name="description"]').attr('content')
          let newImage = $ ('img');

          if(newTitle) {
            resObj.title = newTitle
          
          }
          if(newDesc) {
            resObj.description = newDesc
          }
          if(newImage){
            resObj.images =[]

            for (let i = 0; i < newImage.length; i++) {
              resObj.images.push($(newImage[i]). attr('src'))
            }
          }
          res.end(JSON.stringify(resObj));
        })

      })
      //res.writeHead('Content-Type','text/html');
      //res.end(JSON.stringify({ name: "hello" }));
    }
  }
);

server.listen(3001);
