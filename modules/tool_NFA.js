// Place algorithm to check NFA memeber ship here.

// Interface/exposed function only 
// take transition table & string as argument.

const inNFA = () => console.log('in tool_NFA');

const interfaceNFA = (NFA_string, NFA_Load) => {
    // driver to code functions to check DFA string membership
    //var csv is the CSV file with headers

        //console.log(typeof(DFA_Load[1][2]))
        const data = arrayToJSONObject(NFA_Load);
        
        const stringData = JSON.stringify(data)
        var parsedData = JSON.parse(stringData)
        
        console.log(data);
        console.log(stringData);
        console.log(parsedData)


        const isAcceptNFA = testNFAmembership(parsedData, NFA_string);
        //var checkAccept = checkAccepting(isAcceptNFA);
        //console.log(checkAccept)
        return isAcceptNFA;           
    }






    function testNFAmembership(NFA, inputString){

      
        ///
    
        //var inputString = "aabaaaaaaab"
    
    
        var parsedData = NFA;
    
    
        for (let i = 0; i < parsedData.length; i++) { // here we get start state
          if(parsedData[i].Statetype == ">"){
            var start = parsedData[i]
    
          }
        }
        var currentState = start;
    
    
        var nextState = currentState;
        
        var stateArr = new Array();
        var newStateArr = new Array();
    
        newStateArr[0] = nextState;
        console.log(stateArr);
    
    
    
    
        for (let i of inputString){ // input char
          var stateArr = new Array();

          stateArr = newStateArr
          console.log("current state array " , stateArr)
          //var epsilonStateArr = new Array();
          var newStateArr = new Array();
          // console.log("this is first char: ", i)
          
          for(let j of stateArr){ // get first state in state array
            // console.log("this is j", j)
            
            var currentState = j
            // console.log(currentState)
    
    
            
    
        for(let c in currentState){ // get the headers from stateArr
          
          
          
          
          if(c == "epsilon"){ // here we just need to find that state transition on epsilon and push to newStateArr
            console.log("reading epsilon")
    
    
    
    
             // if header is equal to input string char
            //console.log("does j:", c , " equal:", i)
            //console.log("this is currentState[c]", currentState[c]);
            var epState = currentState[c] // split here into another array
            var epState = epState.split(";")
    
    
            console.log("this is currstate to find in epsilon", epState)
            // gonna need to loop on multiple states to find
            
    
    
            for(let eplisonTran of epState){
              
              // var eplisonTran = eplisonTran
              console.log("eplison stateToFind: ", epState)
            
              console.log("eplison stateToFind: ", eplisonTran)
            
              
              for (let p = 0; p < parsedData.length; p++) {
                  
    
                  //console.log("this is stateToFind" ,stateTofind)
    
    
                    if(parsedData[p].State == eplisonTran){
                      
                      
                      newStateArr.push(parsedData[p])
                      console.log(parsedData[p])
                      console.log("this is new state arr in epsilon", newStateArr)
    
    
    
    
    
                    }
                  }
                }
              }
     
          
    
    
          
    
          if(c == i){
    
    
             // if header is equal to input string char
            //console.log("does j:", c , " equal:", i)
            //console.log("this is currentState[c]", currentState[c]);
            var currState = currentState[c] // split here into another array
            var currState = currState.split(";")
            //console.log("this is currstate", currState)
            // gonna need to loop on multiple states to find
    
    
    
            for(let stateTofind of currState){// 
              
              var stateToFind = stateTofind
    
              console.log("stateToFind: ", stateToFind)
    
                for (let p = 0; p < parsedData.length; p++) {
                  
    
                  //console.log("this is stateToFind" ,stateTofind)
    
    
                    if(parsedData[p].State == stateToFind){
                      newStateArr.push(parsedData[p])
                      //console.log(parsedData[p])
                      console.log("this is new state arr in normal", newStateArr)
    
    
    
    
    
                    }
    
                    
                    //return
                  }
                  
    
    
            }
    
    
        }
        
    
    
    
    
    
        }
    
    
    
    
    
      }
    
    
      
    
    }

    stateArr = newStateArr
    
    // console.log(stateArr)
    // checkAccepting(stateArr)
    for(let i of stateArr){
      if(i.Statetype == "@"){
        console.log(stateArr)
        
        console.log("state is accepting")
        return true;
      }
      
    }
      console.log(stateArr)
      console.log("state is rejecting")
      return false;
    }
    
    
    
    
    
    // }
    
    
    
            // function checkAccepting(stateArr){
            //   for(let i of stateArr){
            //     if(i.Statetype == "@"){
                  
            //       console.log("state is accepting")
            //       return true;
            //     }
                
            //   }
               
            //     console.log("state is rejecting")
            //     return false;
            //   }
            












function arrayToJSONObject (arr){
    //header
    var keys = arr[0];
 
    //vacate keys from main array
    var newArr = arr.slice(1, arr.length);
 
    var formatted = [],
    data = newArr,
    cols = keys,
    l = cols.length;
    for (var i=0; i<data.length; i++) {
            var d = data[i],
                    o = {};
            for (var j=0; j<l; j++)
                    o[cols[j]] = d[j];
            formatted.push(o);
    }
    return formatted;
}

export {
    inNFA,
    interfaceNFA
};