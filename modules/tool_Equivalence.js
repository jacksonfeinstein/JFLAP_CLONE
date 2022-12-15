// Place algorithm to check for DFA equivalence here.

// Interface/exposed function only 
// take transition tables as argument.

const inEquivalence = () => console.log('in tool_Equivalence');

const interfaceEquivalence = (DFA_EquivFirstLoad, DFA_EquivSecondLoad) => {
    console.log(DFA_EquivFirstLoad);
    console.log(DFA_EquivSecondLoad);
}

export {
    inEquivalence,
    interfaceEquivalence
}