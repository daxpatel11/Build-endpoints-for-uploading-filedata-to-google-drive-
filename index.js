const {google} = require('googleapis');
const path = require('path');
const fs= require('fs');
const express = require('express');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
const bodyParser = require('body-parser');
const fileupload  = require('express-fileupload');
require('dotenv').config();
const app=  express();
app.use(fileupload());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const REDIRECT_URL = process.env.REDIRECT_URL;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
)


oauth2Client.setCredentials({refresh_token : REFRESH_TOKEN});
console.log(oauth2Client);
const drive = google.drive({
    version : 'v3',
    auth : oauth2Client
})

const port = 3000;
app.listen(port);
app.use(express.json());

var  Readable = require('stream').Readable; 

function bufferToStream(buffer) { 
  var stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}

app.post('/upload' ,  async (req,res) => {
    
    try{
    //    console.log(req.files);
       
        const response = await drive.files.create({
            requestBody : {
                name :req.files.Image.name,
                mimeType : req.files.Image.mimeType 
            },
            media : {
                mimeType :  req.files.Image.mimeType ,
                // body : fs.createReadStream(req.files.data)
                body :  bufferToStream(req.files.Image.data)
            }
        })
        console.log(response.data);

    }
    catch(err){
        console.log(err.message);
    }
})


app.post('/delete' ,async () => {
    try{
        const response = await drive.files.delete({
            fileId : '****',
        });
        // console.log(response.data,response.status);

    }
    catch(error){
        // console.log(error.message);
    }
})


 async function sharePublicly(){
     try{
         const fileId = '****';
         await drive.permissions.create({
             fileId : fileId,
             requestBody : {
                 role : 'reader',
                 type : 'anyone'
             }
         })
     }
     catch(error)
    {
        console.log(err.message);
    }
 }
//  sharePublicly();