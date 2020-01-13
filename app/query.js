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
        await gateawy.connect(cpp,{wallet:wallet,identity:'user1',discovery: { enabled: true, asLocalhost: true }})
        const network = await gateawy.getNetwork('devchannel')
        const contract = await network.getContract('fabcar')
        var response
        // const response = await contract.evaluateTransaction('queryCar','1')
        response = await contract.evaluateTransaction('queryCar',"1")
        // if (isQuery){
        //     switch (funcName){
        //         case ("queryAllCar") : 
        //             response = await contract.evaluateTransaction('queryAllCar')
        //             break
                
        //         case ("queryCar") :
        //             if (args){response = await contract.evaluateTransaction('queryCar',args[0])}
        //             else {response="To query a car, provide number of car"}
        //             break
                
        //     }
        // }
        // else{
        //     switch (funcName){
        //         case ("addCar"):{
        //             response = await contract.submitTransaction("addCar",args)
        //         }
        //     }
        // }
        console.log(response.toString())
    } catch (error) {
        console.log(error)
    }
}
main(true,'queryAllCar',["10"])
// main(false,"addCar",["523","BMW","TW","Pritam"].toString())