const fs = require('fs')
const yaml = require('js-yaml')
const FabricCAServices = require('fabric-ca-client')
const { FileSystemWallet, X509WalletMixin } = require('fabric-network')
const CONNECTION_PROFILE_PATH='./connection.yaml'
const cpp = yaml.safeLoadAll(fs.readFileSync(CONNECTION_PROFILE_PATH))
const WALLET_PATH='./wallet'
async function main(){
    try {
        const caInfo = cpp[0].certificateAuthorities['devca']
        console.log(caInfo)
        const ca = new FabricCAServices(caInfo.url)
        const wallet = new FileSystemWallet(WALLET_PATH)
        const admin = await wallet.exists('admin')
        if (admin){
            console.log('An identity for the admin user "admin" already exists in the wallet')
            return
        }
        const enrollment = await ca.enroll({enrollmentID:'admin',enrollmentSecret:'adminpw'})
        const identity = X509WalletMixin.createIdentity('Org1MSP',enrollment.certificate,enrollment.key.toBytes())
        await wallet.import('admin',identity)
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet')
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`)
        process.exit(1)
    }
}
main()