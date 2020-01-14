const fs = require('fs')
const yaml = require('js-yaml')
const {Gateway,FileSystemWallet} = require('fabric-network')
const CONNECTION_PROFILE_PATH = './connection.yaml'
const WALLET_PATH= './wallet'
const cpp = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE_PATH))
const main = async (isQuery,funcName,args)=>{
    try {
        const wallet = new FileSystemWallet(WALLET_PATH)
        const userExists = wallet.exists('user1')
        if (!userExists){
            console.log('user1 doesnt exist')
            return
        }
        const gateawy = new Gateway()
        await gateawy.connect(cpp,{wallet:wallet,identity:'user1',discovery: { enabled: false, asLocalhost: true }})
        const network = await gateawy.getNetwork('devchannel')
        let contract =  network.getContract('fabcar')
        return await contract
        // var response
        // const response = await contract.evaluateTransaction('queryCar','1')
        // response = await contract.evaluateTransaction('queryAllCar')
        // if (isQuery){
        //     switch (funcName){
        //         case ("queryAllCar") : 
        //             response = await contract.evaluateTransaction('queryAllCar')
        //             break
                
        //         case ("queryCar") :
        //             if (args){response = await contract.evaluateTransaction('queryCar',args[0])}
        //             else {response="To query a car, provide number of car"}
        //             break
        //         default:
        //             response = "No function found"
        //             process.exit()   
                
        //     }
        // }
        // else{
        //     switch (funcName){
        //         case ("addCar"):
        //             response = await contract.submitTransaction("addCar",`CAR${args[0]}`,args[1],args[2],args[3],args[4])
        //             break
        //         case ("initLedger"):
        //             response = await contract.submitTransaction("initLedger")
        //             break
        //         default:
        //             response = "No function found"
        //             process.exit()
        //     }
        // }
        await gateawy.disconnect()
        return response.toString()
    } catch (error) {
        console.log(error)
    }
}
// main(false,'addCar',"25","LO",)
// main(false,"addCar",["52","BMW","TW","Red","Pritam"])
// main(true,'queryAllCar')
// console.log(main(true,'queryCar',["11"]))

function queryAllCar(){
    let contract = main()
    response =  contract.evaluateTransaction('queryAllCar')
    console.log(response.toString())
}
queryAllCar()