#How to setup the network

cryptogen generate --config=./crypto-config.yaml
mkdir channel-artifacts
configtxgen -profile Genesis -outputBlock ./channel-artifacts/genesis.block -channelID dev
configtxgen -profile DevChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID devchannel
configtxgen -profile DevChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1AnchorUpdate.tx -channelID devchannel -asOrg Org1
change *-cert.pem and *_sk from peerOrg/ca folder to cert.pem and PRIVATE_KEY respectively