// Handles drawing and redrawing of transitions between states.

// All interface functions take array of state objects. 

const RADIUS = 30;
const LOOP_RADIUS = 40;
const LINE_WIDTH = 2;
const TRI_SIDE_LENGTH = 10;

const inTransitionHandler = () => console.log('in transition handler');

const drawTransition = (ctx, curX, curY, nextX, nextY, transitions) => {
    if (curX === nextX && curY === nextY){
        drawLoop(ctx, curX, curY, transitions);
    } else {
        drawLine(ctx, curX, curY, nextX, nextY, transitions);
    }
};

const drawLoop = (ctx, curX, curY, transitions) => {
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    // Draws circle.
    ctx.arc(
        curX, 
        curY - LOOP_RADIUS - RADIUS, 
        LOOP_RADIUS, 
        0, 
        2 * Math.PI
    );
    // Fill line
    ctx.stroke();
    // Transition label
    printLabel(ctx, transitions, curX, curY - (3 * LOOP_RADIUS));
    // Draws triangle.
    ctx.beginPath();
    ctx.moveTo(curX - 10, curY - RADIUS);
    ctx.lineTo(curX + 10, curY - RADIUS - 10);
    ctx.lineTo(curX + 10, curY - RADIUS + 10);
    ctx.fill();
};

const drawLine = (ctx, curX, curY, nextX, nextY, transitions) => {
    //console.log(curX);
    //console.log(curY);
    //console.log(nextY);
    //console.log(nextY);
    const onCurrent = pointOnCircle(curX, curY, nextX, nextY, RADIUS);
    const onNext = pointOnNextCircle(nextX, nextY, curX, curY, RADIUS);
    const curX_Circle = onCurrent['x'];
    const curY_Circle = onCurrent['y'];
    const nextX_Circle = onNext['x'];
    const nextY_Circle = onNext['y']; 
    const midpointX = (nextX_Circle + curX_Circle) / 2;
    const midpointY = (nextY_Circle + curY_Circle) / 2; 
    // Transition line
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(curX_Circle, curY_Circle);
    ctx.lineTo(nextX_Circle, nextY_Circle);
    ctx.stroke();
    // Transition label
    printLabel(ctx, transitions, midpointX, midpointY);
    // Transition arrow.
    drawArrow(ctx, curX_Circle, curY_Circle, nextX_Circle, nextY_Circle);
}

const printLabel = (ctx, transitions, midpointX, midpointY) => {
    // Format transitions
    let label = '';
    transitions.forEach(transition => {
        label = label.concat(' ', transition['transition']);
    });
    ctx.font = '20px Arial';
    ctx.fillText(label, midpointX, midpointY);
};

const pointOnCircle = (first_X, first_Y, second_X, second_Y, R) => {
    // Values for determining circle quadrant.
    const width = second_X - first_X;
    const height = second_Y - first_Y;
    const distance = Math.sqrt((width * width) + (height * height));
    const sine = height / distance;
    const cosine = width / distance;
    const tangent = height / width;
    // Coordinates for 45 degress in unit circle.
    let cosX;
    let sinY;
    // Determine coordiantes for 45 degrees in 
    // unit circle based on quadrant.
    if (sine > 0 && cosine > 0 && tangent > 0) {
        // Quadrant 1.
        cosX = Math.sqrt(2) / 2;
        sinY = Math.sqrt(2) / 2;
    } else if (sine > 0 && cosine < 0 && tangent < 0) {
        // Quadrant 2.
        cosX = -1 * ( Math.sqrt(2) / 2 );
        sinY = Math.sqrt(2) / 2;
    } else if (sine < 0 && cosine < 0 && tangent > 0) {
        // Quadrant 3.
        cosX = -1 * ( Math.sqrt(2) / 2 );
        sinY = -1 * ( Math.sqrt(2) / 2 );
    } else if (sine < 0 && cosine > 0 && tangent < 0) {
        // Quadrant 4.
        cosX = Math.sqrt(2) / 2;
        sinY = -1 * ( Math.sqrt(2) / 2 );
    }
    // Determine point at 45 degrees on circle.
    const x_OnCircle = first_X + (R * cosX);
    const y_OnCircle = first_Y + (R * sinY);
    // Return object contain x & y coordinates.
    return {x: x_OnCircle, y: y_OnCircle};
}

const pointOnNextCircle = (first_X, first_Y, second_X, second_Y, R) => {
    // Values for determining circle quadrant.
    const width = second_X - first_X;
    const height = second_Y - first_Y;
    const distance = Math.sqrt((width * width) + (height * height));
    const sine = height / distance;
    const cosine = width / distance;
    const tangent = height / width;
    // Coordinates for 45 degress in unit circle.
    let cosX;
    let sinY;
    // Determine coordiantes for 45 degrees in 
    // unit circle based on quadrant.
    if (sine > 0 && cosine > 0 && tangent > 0) {
        // Quadrant 2.
        cosX = Math.sqrt(2) / 2;
        sinY = -1 * ( Math.sqrt(2) / 2 );        
    } else if (sine > 0 && cosine < 0 && tangent < 0) {
        // Quadrant 3.
        cosX = Math.sqrt(2) / 2;
        sinY = Math.sqrt(2) / 2;
    } else if (sine < 0 && cosine < 0 && tangent > 0) {
        // Quadrant 4.
        cosX = -1 * ( Math.sqrt(2) / 2 );
        sinY = Math.sqrt(2) / 2;
    } else if (sine < 0 && cosine > 0 && tangent < 0) {
        // Quadrant 1.
        cosX = -1 * ( Math.sqrt(2) / 2 );
        sinY = -1 * ( Math.sqrt(2) / 2 );
    }
    // Determine point at 45 degrees on circle.
    const x_OnCircle = first_X + (R * cosX);
    const y_OnCircle = first_Y + (R * sinY);
    // Return object contain x & y coordinates.
    return {x: x_OnCircle, y: y_OnCircle};
}

const drawArrow = (ctx, curX, curY, nextX,  nextY) => {
    // Side lengths of triangle with hypotenuse between current & next.
    const width = nextX - curX;
    const height = nextY - curY;
    const distance = Math.sqrt((width * width) + (height * height));
    // Angles of triangle corners that aren't 90 degress.
    const angleB = Math.asin(width / distance);
    const angleA = Math.asin(height / distance);
    // Side lengths of triangle with hypotenuse between arrow base & next point.
    const arrowX = Math.sin(angleB) * TRI_SIDE_LENGTH;
    const arrowY = Math.sin(angleA) * TRI_SIDE_LENGTH;
    // Point on line from current to next point.
    const newX = nextX - arrowX;
    const newY = nextY - arrowY;
    // Get direction vector from new point to end point.
    const directionalVector = getDirectionalVector(newX, newY, nextX, nextY);
    const directionalX = directionalVector['x'];
    const directionalY = directionalVector['y'];
    // Point on arrow.
    const firstPointX = newX + directionalY;
    const firstPointY = newY - directionalX;
    // Another point on arrow.
    const nextPointX = newX - directionalX;
    const nextPointy = newY + directionalY;
    
    console.log('drawing arrow');
    ctx.beginPath();
    ctx.moveTo(firstPointX, firstPointY);
    ctx.lineTo(nextPointX, nextPointy);
    ctx.lineTo(nextX, nextY);
    ctx.stroke();
    // Place holder: circle indicates direction.
    ctx.beginPath();
    // Draws circle.
    ctx.arc(
        nextX, 
        nextY , 
        8, 
        0, 
        2 * Math.PI
    );
    // Fill line
    ctx.fill();
}

const getDirectionalVector = (curX, curY, nextX, nextY) => {
    const x_component = nextX - curX;
    const y_component = nextY - curY;
    return {x: x_component, y: y_component};
}

export {
    inTransitionHandler,
    drawTransition
}