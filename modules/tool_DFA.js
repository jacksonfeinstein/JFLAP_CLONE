

const inDFA = () => console.log('in tool_DFA');

const interfaceDFA = (DFAstring, DFA_Load) => {
    // driver to code functions to check DFA string membership
    //var csv is the CSV file with headers

        //console.log(typeof(DFA_Load[1][2]))
        const data = arrayToJSONObject(DFA_Load);
        
        const stringData = JSON.stringify(data)
        var parsedData = JSON.parse(stringData)
        
        console.log(data);
        console.log(stringData);
        console.log(parsedData)


        const isAcceptDFA = testDFAmembership(parsedData, DFAstring);

        return isAcceptDFA;           
    }



    function testDFAmembership(DFA, inputString){ // add input string as parameter later
      
        //var inputString = "ababb"
       // take input string at [0] and then find the transition on that input to get next state
       // if a = char, then something like if char == a 
         // console.log(DFA)
 
         var parsedData = DFA;
 
         //console.log("break 1")
         // console.log(DFA)
         // console.log(parsedData[0].State)
         // console.log(parsedData[0].Statetype)
         // console.log(parsedData[1])
         var start
         for (let i = 0; i < parsedData.length; i++) { // here we get start state
           if(parsedData[i].Statetype == ">"){
             var start = parsedData[i]
             console.log(start.State)
             console.log(start)
           }
         }
         //console.log("break 2")
         var currentState = start;
         // 
 
         // at the end of this loop test final state
 
 
         var nextState = currentState;
 
         for(let j of inputString){
           
           //console.log(nextState)
           console.log("current j value : ", j) // we get input character from input 
           var transition = j
           // find new state from transition table on input j
           // current state on input a goes to next state
 
           // turn this hole thing into a loop that loops each index until it finds
           // the right input transtion so like if 
 
 
 
 
 
           for (let i in nextState){ // new function that iterates through dfa, does not need a fixed language of chars
 
               console.log(i)
 
               if (i == j){
 
                 // reach into nextstate to get value at I
 
                 console.log(nextState[i])
                 var stateToFind = nextState[i];
 
                 for (let i = 0; i < parsedData.length; i++) {// here we get start state
               //console.log("this is the state: ",parsedData[i].State, "this is state to find: ", stateToFind) // here we get start state
               //console.log(parsedData[i].State == stateToFind)
                   if(parsedData[i].State == stateToFind){
                     var nextState = parsedData[i]
                 // console.log("in is a")
                 console.log(nextState.State)
                 console.log("new state ", nextState)
               }
 
 
 
               }
 
 
           }
         }
 
           
           
           
           
           
           } // Checking final state if is accepting 
           
           if(nextState.Statetype == "@"){
             
             console.log("state is accepting")
             return true;
           }
           else{
             
             console.log("state is rejecting")
             return false;
           }
 
 
 
         }






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
    inDFA,
    interfaceDFA
};