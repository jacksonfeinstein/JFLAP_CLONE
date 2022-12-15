// Place algorithm to check minimize state here.

// Interface/exposed function only
// take transition table as argument.

const inMimization = () => console.log("in tool_Minimization");

const interfaceMinimization = (DFA_MinimizationLoad) => {
  console.log(DFA_MinimizationLoad);
};

/*
Todo: get accepting states
const accepting = new set([]);
*/

/*
Todo: identify alphabet
const alpahbet = new set([]);
*/

let currentTransitionMap = {};

function minimizeDFA(dfa) {
  const allStates = Object.keys(dfa);
  const nonAccepting = new Set();
  const accepting = new Set();


  // Step 1: build equivalent sets.
  const all = [[nonAccepting, accepting].filter((set) => set.size > 0)]; // 0-equivalent sets.

  let current;
  let previous;

  // Top of the stack is the current list of sets to analyze.
  current = all[all.length - 1];

  // Previous set (to check whether we need to stop).
  previous = all[all.length - 2];

  // Until N and N-1 not equivalent rows.
  while (!sameEquivalanceRow(current, previous)) {
    const newTransitionMap = {};

    for (const set of current) {
      const handledStates = {};

      const [first, ...rest] = set;
      handledStates[first] = new Set([first]);

      // compare to rest of states see if they are equivalent.
      restEquivalentGroups: for (const state of rest) {
        for (const handledState of Object.keys(handledStates)) {
          if (areEquivalent(state, handledState)) {
            handledStates[handledState].add(state);
            handledStates[state] = handledStates[handledState];
            continue restEquivalentGroups;
          }
        }

        // create new Equivalence group if state is not equivalent to any other
        handledStates[state] = new Set([state]);
      }

      // Add these handled states to all states map.
      Object.assign(newTransitionMap, handledStates);
    }

    // Update current transition map for the handled row.
    currentTransitionMap = newTransitionMap;

    let newSets = new Set(
      Object.keys(newTransitionMap).map((state) => newTransitionMap[state])
    );

    all.push([...newSets]);

    // Top of the stack is the current equivalance group
    current = all[all.length - 1];

    // Previous equivalance group
    previous = all[all.length - 2];
  }

  // Step 2: build minimized table from the equivalent sets.
  const newEquivalanceGroups = new Map();

  let idx = 1;
  current.forEach((set) => newEquivalanceGroups.set(set, idx++));

  const minimized = {};

  for (const [set, idx] of newEquivalanceGroups.entries()) {
    minimized[idx] = {};
    for (const symbol of alphabet) {
      const originalState = [...set][0];
      const originalTransition = table[originalState][symbol];

      if (originalTransition) {
        minimized[idx][symbol] = newEquivalanceGroups.get(
          currentTransitionMap[originalTransition]
        );
      }
    }
  }

  return minimized;
}

function sameEquivalanceRow(r1, r2) {
  if (!r2 || r1.length !== r2.length) {
    return false;
  }

  for (let i = 0; i < r1.length; i++) {
    const state1 = r1[i];
    const state2 = r2[i];

    if (
      state1.size !== state2.size ||
      [...state1].sort().join(",") !== [...state2].sort().join(",")
    ) {
      return false;
    }
  }

  return true;
}

function areEquivalent(state1, state2) {
  for (const symbol of alphabet) {
    if (
      !currentTransitionMap[state1] ||
      !currentTransitionMap[state2] ||
      currentTransitionMap[state1][symbol] !== currentTransitionMap[state2][symbol]
    ) {
      return false;
    }
  }
  return true;
}

export { inMimization, interfaceMinimization };
