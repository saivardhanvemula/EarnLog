const express=require('express')
const cors=require('cors')
const { MongoClient } = require('mongodb')

const app=express()
app.use(cors())
app.use(express.json())
const port =3000

// const uri = 'mongodb://localhost:27017'
const uri='mongodb+srv://saivardhanvemulamncl:sai7626@projects.dwgzndr.mongodb.net/?retryWrites=true&w=majority&appName=projects'
// const uri='mongodb+srv://saivardhanvemulamncl:sai@7626@projects.dwgzndr.mongodb.net/?retryWrites=true&w=majority&appName=projects'
    // const uri ='mongodb+srv://saivardhanvemulamncl:sai7626@bustracker.z9ztvx3.mongodb.net/';


    
const client = new MongoClient(uri)

app.post('/new', async (req, res) => {
    try {
        const formdata=req.body
        await client.connect();
        const db = client.db('EarnLog');
        const collection = db.collection('Logs');
        const data = await collection.insertOne(formdata)
        console.log(data);
        res.send({status:200});
        // await client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Server Error'});
    }
});
app.get('/data', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('EarnLog');
        const collection = db.collection('Logs');
        const data = await collection.find({}).toArray();
        console.log(data);
        res.json(data);
        await client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Server Error'});
    }
});

app.listen(port,()=>{console.log('The server running on http://localhost:3000/')})