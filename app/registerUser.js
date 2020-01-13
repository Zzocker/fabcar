const fs = require('fs')
const yaml = require('js-yaml')
const { Gateway,FileSystemWallet, X509WalletMixin } = require('fabric-network')
const CONNECTION_PROFILE_PATH= './connection.yaml'
const WALLET_PATH='./wallet'
const cpp = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE_PATH))
async function main(){
    try{
        const wallet = new FileSystemWallet(WALLET_PATH)
        const userExists = await wallet.exists('user1')
        // console.log(userExists)
        if (userExists){
            console.log('user1 already exists')
            return
        }
        const adminExist = await wallet.exists('admin')
        if (!adminExist){
            console.log('admin doesn exists')
            return 
        }
        // console.log(adminExist)
        const gateway = new Gateway()
        await gateway.connect(cpp,{wallet:wallet,identity:'admin', discovery: { enabled: true, asLocalhost: true }})
        // console.log(gateway.getClient().getCertificateAuthority())
        // console.log(gateway.getCurrentIdentity())
        const ca = gateway.getClient().getCertificateAuthority()
        const adminIdentity = gateway.getCurrentIdentity()
        const secret = await ca.register({affiliation:"org1",enrollmentID:'user1',role:'client'},adminIdentity)
        const enrollment =  await ca.enroll({enrollmentID:'user1',enrollmentSecret:secret})
        const identity = X509WalletMixin.createIdentity('Org1MSP',enrollment.certificate,enrollment.key.toBytes())
        await wallet.import('user1',identity)
        console.log('Successfully registered and enrol user1 to the network')
    }catch(e){
        console.log(e)
        process.exit(1)
    }
}
main()