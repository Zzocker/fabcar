const fs = require('fs')
const yaml = require('js-yaml')
const {Gateway,FileSystemWallet} = require('fabric-network')
const CONNECTION_PROFILE_PATH='./connection.yaml'
const WALLET_PATH = './wallet'
const cpp = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE_PATH))
async function main(){
    try {
        const wallet = new FileSystemWallet(WALLET_PATH)
    const userExists = await wallet.exists('user1')
    if (!userExists){
        console.log("User1 doesn't exists")
        return
    }
    const gateway = new  Gateway()
    await gateway.connect(cpp,{wallet:wallet,identity:"user1",discovery:{enabled:false,asLocalhost:true}})
    const network = await gateway.getNetwork('devchannel')
    // console.log(network.getContract('fabcar').network.channel._anchor_peers)
    const contract = network.getContract('fabcar')
    response = await contract.submitTransaction("addCar","10","BMW","TW","Red","Pritam",)
    // console.log(response.toString())
    await gateway.disconnect()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
main()