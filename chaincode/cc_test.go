package main

import (
	"testing"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-chaincode-go/shimtest"
)

func initChaincode(t *testing.T) *shimtest.MockStub {
	stub := shimtest.NewMockStub("fabcar", new(SmartContract))
	response := stub.MockInit("init", nil)
	t.Logf("Init status code = %d", response.Status)
	if response.Status != shim.OK {
		t.FailNow()
	}
	return stub
}
func TestInvoke(t *testing.T) {
	stub := initChaincode(t)
	ccargs := SetupArgsArray("initLedger")
	response := stub.MockInvoke("initLedger", ccargs)
	t.Logf("Response=%d", response.GetStatus())
	if response.Status != shim.OK {
		t.FailNow()
	}
	ccargs =  SetupArgsArray("queryCar","1")
	response = stub.MockInvoke("queryCar",ccargs)
	t.Logf("Response=%d", response.GetStatus())
	if response.Status != shim.OK {
		t.FailNow()
	}
	t.Log(string(response.Payload))
}
func SetupArgsArray(funcName string, args ...string) [][]byte {
	ccArgs := make([][]byte, 1+len(args))
	ccArgs[0] = []byte(funcName)
	for i, arg := range args {
		ccArgs[i+1] = []byte(arg)
	}

	return ccArgs
}
