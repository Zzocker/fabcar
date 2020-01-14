const {Gateway,FileSystemWallet} = require('fabric-network')
const yaml = require('js-yaml')
const fs = require('fs')
const CONNECTION_PROFILE_PATH= './connection.yaml'
const WALLET_PATH= './wallet'
const IDENTITY = 'user1'
const CHANNEL = 'devchannel'
const CONTRACT = 'fabcar'
async function connectNetwork(){
    const ccp = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE_PATH))
    const wallet = new FileSystemWallet(WALLET_PATH)
    const userExists = await wallet.exists(IDENTITY)
    if (!userExists){
        console.log("user1 doesn't exists")
        return
    }
    const gateway = new Gateway()
    await gateway.connect(ccp,{wallet:wallet,identity:IDENTITY,discovery: {
        enabled: true,
        asLocalhost: true
    }})
    const network = await gateway.getNetwork(CHANNEL)
    const contract = network.getContract(CONTRACT)
    return contract
}
module.exports = {connectNetwork}