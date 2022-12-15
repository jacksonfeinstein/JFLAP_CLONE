// Handles rendering and rerendering the 
// state diagram. 
import State from "./graphics/State.js";
import { drawTransition } from "./graphics/transition_Handler.js";
// Handle operations with DFA, NFA,
// DFA equivalence, and DFA minimization. 
import { inDFA, interfaceDFA } from "./modules/tool_DFA.js";
import { inNFA, interfaceNFA } from "./modules/tool_NFA.js";
import { inEquivalence, interfaceEquivalence } from "./modules/tool_Equivalence.js";
import { inMimization, interfaceMinimization } from "./modules/tool_Minimization.js";

// *Remove after testing
inDFA();
inNFA()
inEquivalence();
inMimization();

// Canvas
const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;    // 80px
const canvasOffsetY = canvas.offsetTop;     // 0px

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

// Popups
const popups = document.getElementById('popups');
const save_popup = document.getElementById('save-popup');
const DFA_popup = document.getElementById('DFA-popup');
const NFA_popup = document.getElementById('NFA-popup');
const equivalence_popup = document.getElementById('equivalence-popup');
const popup_overlay = document.getElementById('popup-overlay');

// FA popup content
// Reads in a file name.
const saveFA = document.getElementById('saveFA');
// Saves the files name.
const saveButton = document.getElementById('save-btn');
// Closes the popup for only this popup *NOT THE OTHER POPUPS. 
const closeButton = document.getElementById('close-button');

// Header content
const DFA_header = document.getElementById('DFA-header');
const NFA_header = document.getElementById('NFA-header');
const equivalence_header = document.getElementById('equivalence-header');

// Circle
let makeCircle = false;

// Edit
let isEditing = false;
let clicked = false;

// Remove
let isRemoving = false;

// Cursor
let useCursor = false;

// States
let states = [];
let stateNumber = 0;

// Data from Files *Should be 2D arrays.
let DFA_Load;
let DFA_EquivFirstLoad;
let DFA_EquivSecondLoad;
let DFA_MinimizationLoad;
let NFA_Load;

// Save csv data into this.
let csvContent = [];


/****************************************************************************** */
// Toolbar
/****************************************************************************** */

// Toolbar button behaviors
toolbar.addEventListener('click', event => {
    // State Diagram.
    if (event.target.id === 'clear') {
        states.length = 0;
        stateNumber = 0;
        //console.log(states);
        ctx.clearRect(0,0, canvas.width, canvas.height);
    } else if (event.target.id === 'circle') {
        makeCircle = true;
        isEditing = false;
        useCursor = false;
        isRemoving = false;
    } else if (event.target.id === 'edit') { 
        console.log('editing');
        isEditing = true;
        makeCircle = false;
        useCursor = false;
        isRemoving = false;
    } else if (event.target.id === 'cursor') {
        console.log('using cursor');
        useCursor = true;
        isEditing = false;
        makeCircle = false;
        isRemoving = false;
    } else if (event.target.id === 'remove'){
        console.log('removing');
        isRemoving = true;
        isEditing = false;
        makeCircle = false;
        useCursor = false;
    } else {
        isEditing = false;
        makeCircle = false;
        useCursor = false;
        isRemoving = false;
    }
    const toggleDisplay = (doc) => {
        if (doc.style.display === 'none') {
            //console.log(doc.style.display);
            doc.style.display = 'block';
        } else {
            //console.log(doc.style.display);
            doc.style.display = 'none';
        }
    }   
    if (event.target.id === 'add') {
        const doc = document.getElementById('overlay');
        toggleDisplay(doc);
    }
    if (event.target.id === 'type') {
        const doc = document.getElementById('type_overlay');
        toggleDisplay(doc);
    }
    
    // Downloads transition table as csv.
    if (event.target.id === 'save') {
        // Open popup up.
        save_popup.classList.add("open-popup");
        // Add greyed out background that stops mouse clicks on it.
        popup_overlay.classList.add("active");

        // Clear csvContent.
        csvContent = [];
        // Get alphabet for the state diagram.
        let alphabet = createAlphabet();
        const createHeader = (csvContent, alphabet) => {
            // Create start of header
            let header = [];
            header.push("Statetype");
            header.push("State");
            // Add alphabet
            alphabet.forEach(symbol => {
                header.push(symbol);
            });
            csvContent.push(header);
        }
        createHeader(csvContent, alphabet);
        
        // Create transition table to print out.
        states.forEach(state => {
            // get grouped states based on transition
            // and add to array.
            // If any values are missing fill them in.
            const groupedStates = state.getGroupedStates();
            
            // Create row then add state type and name.
            let row = [];
            row.push(state.getType());
            row.push(state.getName());

            if (Object.keys(groupedStates).length === 0){
                //console.log("empty object");                
                // State doesn't transition to other states.
                // Adds empty sets for all transitions.
                alphabet.forEach(() => {
                    row.push("");
                });
            } else {
                // State does transition to another state or other states.
                // Add symbol or set of symbols to corresponding 
                    // symbol in alphabet.
                alphabet.forEach(symbol => {
                    // If the symbol matches a key in groupedStates.
                    if (Object.hasOwn(groupedStates, symbol)){
                        //console.log("has " + symbol)
                        //console.log(groupedStates[symbol])
                        // Gather all states on same transition.
                        let stateSet = '';
                    
                        groupedStates[symbol].forEach(pair => {
                            stateSet = stateSet.concat(pair['state']);
                            stateSet = stateSet.concat(';');
                        });
                        // Removes extra semicolon at the end.
                        stateSet = stateSet.slice(0, -1);
                        
                        row.push(stateSet);
                    } else {
                        //console.log("no " + symbol)
                        row.push("");
                    }
                })
            }
            csvContent.push(row);
        });
        console.log(csvContent);
    }
    
    // DFA / NFA operations.
    if (event.target.id === 'DFAmembership') {
        console.log('DFA membership');
        const DFAstring = document.getElementById('DFAstring');
        let result = false;
        
        // Get DFA as CSV.
        // Get String to check membership.
        if (DFAstring.value != undefined && DFA_Load != undefined){
            removeExtraRow(DFA_Load);
            result = interfaceDFA(DFAstring.value, DFA_Load);
        }

        // Activate popup.
        DFA_popup.classList.add("open-popup");
        popup_overlay.classList.add("active");
    
        if (result){
            DFA_header.append("String is a member");
        } else {
            DFA_header.append("String is not a member");
        }
    } else if (event.target.id === 'testDFAequivalence') {
        console.log('DFA quivalence');
        let result = false;
        // Get first DFA as CSV.
        // Get second DFA as CSV.
        if (DFA_EquivFirstLoad != undefined && DFA_EquivSecondLoad != undefined){
            removeExtraRow(DFA_EquivFirstLoad);
            removeExtraRow(DFA_EquivSecondLoad);
            result = interfaceEquivalence(DFA_EquivFirstLoad, DFA_EquivSecondLoad);
        }

        // Activate popup.
        equivalence_popup.classList.add("open-popup");
        popup_overlay.classList.add("active");

        if (result) {
            equivalence_header.append("Equivalent");
        } else {
            equivalence_header.append("Not equivalent");
        }
    } else if (event.target.id === 'DFAminimize') {
        console.log('DFA minimize');
        let result = [];
        // Get DFA as CSV.
        if (DFA_MinimizationLoad != undefined){
            removeExtraRow(DFA_MinimizationLoad);
            result = interfaceMinimization(DFA_MinimizationLoad);
        }

        // Download minimized DFA.
        download('minimized_DFA.csv', result);
    } else if (event.target.id === 'NFAmembership'){
        console.log('NFA membership');

        const NFAstring = document.getElementById('NFAstring');
        let result = false;
        
        // Get NFA as CSV.
        // Get String to check memberhsip.
        if (NFAstring.value != undefined && NFA_Load != undefined){
            removeExtraRow(NFA_Load);
            result = interfaceNFA(NFAstring.value, NFA_Load);
        }

        // Activate popup.
        NFA_popup.classList.add("open-popup");
        popup_overlay.classList.add("active");
    
        if (result){
            NFA_header.append("String is a member");
        } else {
            NFA_header.append("String is not a member");
        }
    }
});

const download = (fileName, text) => {
    // Format array to CSV
    let formatedText = "";
    text.forEach( array => {
        let row = array.join(",");
        formatedText += row + "\r\n";
    });
    
    const element = document.createElement('a');
    element.style.display = 'none';
    
    element.setAttribute(
        'href', 
        'data:application/xml;charset=utf-8,' + encodeURIComponent(formatedText)
    );
    
    element.setAttribute('download', fileName);
    document.body.appendChild(element);
    
    element.click();
    document.body.removeChild(element);
}

const removeExtraRow = (csv) => {
    csv.forEach(row => {
        if (row.length == 1){
            csv.pop();
        }
    })
}

const createAlphabet = () => {
    let alphabet = [];
    // Fill alphabet with all symbols regardless of duplicates.
    states.forEach(state => {
        state.getTransitions().forEach( transition => {
            alphabet.push(transition['transition']);
        });
    });
    // Order alphabet
    alphabet.sort();
    // Remove duplicate symbols using a Set
    alphabet = new Set(alphabet);
    // Convert set back to an array.
    alphabet = [...alphabet];

    return alphabet;
}

// Gets the files and strings.
toolbar.addEventListener('change', event => {
    if (event.target.id === 'DFA') {
        const fileInput = document.querySelector('#DFA');
        const fr = new FileReader();
        
        fr.readAsText(fileInput.files[0]);

        // Needs to be async function so variables get saved.
        fr.addEventListener('load', () => {
            const csv = fr.result;
            // Parse csv to array.
            DFA_Load = csv.split('\r\n').map(line => {
                return line.split(',');
            })
        }); 

    } else if (event.target.id === 'firstFile') {
        const fileInput = document.querySelector('#firstFile');
        const fr = new FileReader();
        
        fr.readAsText(fileInput.files[0]);

        // Needs to be async function so variables get saved.
        fr.addEventListener('load', () => {
            const csv = fr.result;
            // Parse csv to array.
            DFA_EquivFirstLoad = csv.split('\r\n').map(line => {
                return line.split(',');
            })
        }); 
    } else if (event.target.id === 'secondFile') {
        const fileInput = document.querySelector('#secondFile');
        const fr = new FileReader();
        
        fr.readAsText(fileInput.files[0]);

        // Needs to be async function so variables get saved.
        fr.addEventListener('load', () => {
            const csv = fr.result;
            // Parse csv to array.
            DFA_EquivSecondLoad = csv.split('\r\n').map(line => {
                return line.split(',');
            })
        }); 
    } else if (event.target.id === 'minimize') {
        const fileInput = document.querySelector('#minimize');
        const fr = new FileReader();
        
        fr.readAsText(fileInput.files[0]);

        // Needs to be async function so variables get saved.
        fr.addEventListener('load', () => {
            const csv = fr.result;
            // Parse csv to array.
            DFA_MinimizationLoad = csv.split('\r\n').map(line => {
                return line.split(',');
            })
            //console.log(DFA_MinimizationLoad);
        });        
    } else if (event.target.id === 'NFA') {
        const fileInput = document.querySelector('#NFA');
        const fr = new FileReader();
        
        fr.readAsText(fileInput.files[0]);

        // Needs to be async function so variables get saved.
        fr.addEventListener('load', () => {
            const csv = fr.result;
            // Parse csv to array.
            NFA_Load = csv.split('\r\n').map(line => {
                return line.split(',');
            })
        }); 
    }
});

/****************************************************************************** */
// Popup
/****************************************************************************** */
// Closes popup when clicking out side the popup box.
popups.addEventListener('click', (event) => {
    if(event.target.id == 'popup-overlay'){
        save_popup.classList.remove("open-popup");
        DFA_popup.classList.remove("open-popup");
        NFA_popup.classList.remove("open-popup");
        equivalence_popup.classList.remove("open-popup");    
        popup_overlay.classList.remove("active");
        DFA_header.innerHTML = '';
        NFA_header.innerHTML = '';
        equivalence_header.innerHTML = '';
    }
});

// Saves the finite automata
saveButton.addEventListener('click', () => {
    download(saveFA.value + '.csv', csvContent);
})

// Close pop up when clicking on the x button.    
closeButton.addEventListener('click', () => {
    console.log("click");
    save_popup.classList.remove("open-popup");
    popup_overlay.classList.remove("active");
});

/****************************************************************************** */
// Canvas
/****************************************************************************** */
canvas.addEventListener('mousedown', event => {
    // Check if clicked on a specific circle.
    if (isEditing){
        // Find circle clicked on.
        states.forEach( e => {
            // Selects the circle.
            if (e.insideCircle(event)){
                console.log('inside circle' + e.getName());
                e.setIsSelected(true);
            }
            clicked = true;
        });
    } else if (isRemoving){
        console.log('removing');
        clicked = false;
        let removeState;
        let removeStateIndex = 0;
        
        // Find state clicked on and remove it from states array.
        states.forEach( state => {
            if (state.insideCircle(event)){
                removeState = state.getName();
                console.log('removing ' + removeState);

                // Remove state from states array.
                states.splice(removeStateIndex, 1);
                clicked = true;                
            }
            if (removeState === undefined){
                removeStateIndex++;
            }
        });

        // Look for transitions to removed state in 
        // other states and remove them.
        states.forEach( state => {
            const removeTransitionIndex = state
                .getTransitions()
                .findIndex( transition => {
                    if (transition['state'] === removeState){
                        return true;
                    }
                    return false;
                });

            if (removeTransitionIndex != -1){
                state.getTransitions()
                 .splice(removeTransitionIndex, 1);
            }
            console.log('removing transition');
            console.log(state.getTransitions());
        });
    
        // Is reused to redraw state types and transitiosn.
        drawStateSymbols(ctx);
    } else if (makeCircle){
        // Make states and add them to stack.
        const newState = new State(
            canvasOffsetX,
            canvasOffsetY,
            event.clientX,
            event.clientY,
            stateNumber.toString(),
            '|',
            []
        )
        states.push(newState);
        newState.drawCircle(event, ctx);
        stateNumber++;
        console.log(states);
    }
});

canvas.addEventListener('mouseup', event => {
    // Reset all selected circles set to true.
    if (isEditing){
        states.forEach( e => {
            if (e.getIsSelected()){
                e.setIsSelected(false); 
            }
        });
        clicked = false;
    }
});

canvas.addEventListener('mousemove', event => {
    // Check if clicked on circle.
    if (isEditing && clicked){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw entire diagram. 
        states.forEach( state => {
            // Draw selected circle to follow mouse.
            // Draw nonselected circles in same place. 
            if (state.getIsSelected()) {
                console.log('mouse move ' + state.getName());
                // Also updates coordinates of selected circle.
                state.drawCircle(event, ctx);
                state.drawStateType(ctx);
            } else {
                state.redrawCircle(ctx);
                state.drawStateType(ctx);
            }
            // Draw all transitions for selected state
            // and nonselected states if they exist.
            if (state.getTransitions().length > 0) {
                const curX = state.getX();
                const curY = state.getY();
                let nxtX;
                let nxtY;                    
                const groupedTransitions = state.getGroupedTransitions();
                // Draw all transitions for current state.
                for (const[key, value] of Object.entries(groupedTransitions)) {
                    // Get coordinates of state transitioning to.
                    states.forEach( s => {
                        if (key === s.getName()) {
                            nxtX = s.getX();
                            nxtY = s.getY();
                        }
                    });
                    drawTransition(
                        ctx, 
                        curX, 
                        curY, 
                        nxtX, 
                        nxtY, 
                        value
                    );                
                }
            }
        });
    } 
});

/****************************************************************************** */
// movable Div
/****************************************************************************** */
const movableDiv = document.getElementById('overlay');

const createPair = (nextState, transition) => {
    return {state: nextState, transition: transition};
};

movableDiv.addEventListener('click', event => {
    if (event.target.id === 'saveTransition'){
        const currentState = document.getElementById('currentState');
        const nextState = document.getElementById('nextState');
        const transition = document.getElementById('transition');
        // Add transition to current state.        
        states.forEach(state => {
            if (state.getName() === currentState.value){
                const stateTransition = createPair(nextState.value, transition.value);
                //console.log(stateTransition);
                state.addTransition(stateTransition);
            }
        });
        // Clear canvas to redraw entire diagram.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw entire diagram with new transition.                         
        states.forEach( state => {
            // Redraw circle.    
            state.redrawCircle(ctx);
            // Draw all transitions that exist.
            if (state.getTransitions().length > 0) {
                const curX = state.getX();
                const curY = state.getY();
                let nxtX;
                let nxtY;                    
                const groupedTransitions = state.getGroupedTransitions();
                // Draw all transitions for current state.
                for (const[key, value] of Object.entries(groupedTransitions)) {
                    // Get coordinates of state transitioning to.
                    states.forEach( s => {
                        if (key === s.getName()) {
                            nxtX = s.getX();
                            nxtY = s.getY();
                        }
                    });
                    drawTransition(
                        ctx, 
                        curX, 
                        curY, 
                        nxtX, 
                        nxtY, 
                        value
                    );                
                }
            }
        });
    }
});

/****************************************************************************** */
// Type overlay
/****************************************************************************** */
const typeOverlay = document.getElementById('type_overlay');

typeOverlay.addEventListener('click', event => {
    const currentState = document.getElementById('currentState_Type');
    // Only change state type if state exists.
    states.forEach(state => {
        if (state.getName() === currentState.value){
            if (event.target.id === 'regularState') {
                console.log('adding regular state');
                state.setType('|');
                drawStateSymbols(ctx);
            } else if (event.target.id === 'startingState') {
                console.log('adding starting state');
                state.setType('>');
                drawStateSymbols(ctx);
            } else if (event.target.id === 'acceptingState') {
                console.log('adding accepting state');
                state.setType('@');
                drawStateSymbols(ctx);
            } else if (event.target.id === 'resetTypes') {
                console.log('reseting types');
                state.setType('|');
                drawStateSymbols(ctx);
            }          
        }
    });
});

const drawStateSymbols = (ctx) => {
    // Clear screan.
    // Redraw states.
    // Draw / redraw state symbols.
    // Draw tansitions.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw entire diagram. 
    states.forEach( state => {
        // Redraw circle and state type.
        state.redrawCircle(ctx);
        state.drawStateType(ctx);

        // Draw all transitions for selected state if they exist.
        if (state.getTransitions().length > 0) {
            const curX = state.getX();
            const curY = state.getY();
            let nxtX;
            let nxtY;                    
            const groupedTransitions = state.getGroupedTransitions();
            // Draw all transitions for current state.
            for (const[key, value] of Object.entries(groupedTransitions)) {
                // Get coordinates of state transitioning to.
                states.forEach( s => {
                    if (key === s.getName()) {
                        nxtX = s.getX();
                        nxtY = s.getY();
                    }
                });
                drawTransition(
                    ctx, 
                    curX, 
                    curY, 
                    nxtX, 
                    nxtY, 
                    value
                );                
            }
        }
    });
}

console.log('in app.js');