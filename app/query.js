const fs = require('fs')
const yaml = require('js-yaml')
const {Gateway,FileSystemWallet} = require('fabric-network')
const CONNECTION_PROFILE_PATH = './connection.yaml'
const WALLET_PATH= './wallet'
const cpp = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE_PATH))
async function main(){
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
        const contract = network.getContract('fabcar')
        const response = await contract.evaluateTransaction('queryAllCar')
        console.log(response.toString())
    } catch (error) {
        console.log(error)
    }
}
main()