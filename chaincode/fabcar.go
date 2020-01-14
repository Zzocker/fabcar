package main

import "github.com/hyperledger/fabric-chaincode-go/shim"
import "github.com/hyperledger/fabric-protos-go/peer"

import "fmt"

import "encoding/json"

import "strconv"

type SmartContract struct {
}
type Car struct {
	Make   string `json:"make"`
	Model  string `json:"model"`
	Colour string `json:"colour"`
	Owner  string `json:"owner"`
}
type QueryResult struct {
	Key    string `json:"Key"`
	Record *Car
}

func (c *SmartContract) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return peer.Response{
		Status:  shim.OK,
		Message: "Chaincode init",
	}
}
func (c *SmartContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	funcName, args := stub.GetFunctionAndParameters()
	switch funcName {
	case "initLedger":
		return initLedger(stub)
	case "queryAllCar":
		return queryAllCar(stub)
	case "addCar":
		return addCar(stub, args)
	case "queryCar":
		return queryCar(stub, args)
	}

	return peer.Response{
		Status:  shim.OK,
		Message: "Chaincode init",
	}
}
func addCar(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 5 {
		return shim.Error("required 5 arguments")
	}
	carNo := args[0]
	car := Car{
		Make:   args[1],
		Model:  args[2],
		Colour: args[3],
		Owner:  args[4],
	}
	carByte, _ := json.Marshal(car)
	stub.PutState("CAR"+carNo, carByte)
	return shim.Success(nil)
}
func queryCar(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Please Provide Car Number")
	}
	carByte, err := stub.GetState("CAR" + args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(carByte) == 0 {
		return shim.Error("Car Number " + args[0] + " doesn't exists")
	}
	car := new(Car)
	json.Unmarshal(carByte, car)
	result := QueryResult{
		Key:    args[0],
		Record: car,
	}
	resultJSON, _ := json.Marshal(result)
	return shim.Success(resultJSON)
}
func initLedger(stub shim.ChaincodeStubInterface) peer.Response {
	cars := []Car{
		Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
		Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
		Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
		Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
		Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
		Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel"},
		Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav"},
		Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari"},
		Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria"},
		Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro"},
	}
	for i, car := range cars {
		carByte, _ := json.Marshal(car)
		stub.PutState("CAR"+strconv.Itoa(i), carByte)
	}
	return shim.Success(nil)
}
func queryAllCar(stub shim.ChaincodeStubInterface) peer.Response {
	startKey := "CAR0"
	endKey := "CAR99"
	result := []QueryResult{}
	resultIterator, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultIterator.Close()
	for resultIterator.HasNext() {
		car := new(Car)
		queryResponse, err := resultIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		json.Unmarshal(queryResponse.GetValue(), car)
		queryres := QueryResult{queryResponse.GetKey(), car}
		result = append(result, queryres)
	}
	resultByte, _ := json.Marshal(result)
	return shim.Success(resultByte)
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Println(err.Error())
	}
}
