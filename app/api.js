const express = require('express')
const api =  express()
const PORT = "3000"

const network = require('./network')

api.get('/api/queryAllCar',async (req,res)=>{
    try {
        const contrct = await network.connectNetwork()
        const response = await contrct.evaluateTransaction('queryAllCar')
        let result  = JSON.parse(response.toString())
        res.json({result:result})
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
      error: error
    })
    }
})
api.get('/api/queryCar/:id',async (req,res)=>{
    try {
    const contrct = await network.connectNetwork()
    const response =await contrct.evaluateTransaction('queryCar',req.params.id.toString())
    let result = JSON.parse(response.toString())
    res.json({result:result})
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
        error: error
    })
    }
})
api.pu
api.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})