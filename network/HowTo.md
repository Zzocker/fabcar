#How to setup the network

1. cryptogen generate --config=./crypto-config.yaml   
2. mkdir channel-artifacts
3. configtxgen -profile Genesis -outputBlock ./channel-artifacts/genesis.block -channelID dev 
4. configtxgen -profile DevChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID devchannel
5. configtxgen -profile DevChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1AnchorUpdate.tx -channelID devchannel -asOrg Org1

