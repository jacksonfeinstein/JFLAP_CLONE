export default class State {
    constructor(
        canvasOffsetX, 
        canvasOffsetY,         
        x, 
        y, 
        name, 
        type, 
        transitionTbl
    ){
        //console.log('in State constructor');        
        // Predetermined.
        this.r = 30;
        this.lineWidth = 3;
        this.textOffset = 7;
        this.isSelcted = false;
        this.groupedTransitions;

        // User determinted.
        this.canvasOffsetX = canvasOffsetX;
        this.canvasOffsetY = canvasOffsetY;
        this.x = x;
        this.y = y;
        this.name = name;
        this.typeFirst = type;
        this.transitionTbl = transitionTbl;
    }

    setIsSelected(condition){
        console.log(`${this.name} is now: ${condition}`);
        this.isSelcted = condition;
    }

    getIsSelected(){
        return this.isSelcted;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    setName(newName){
        this.name = newName;
    }

    getName(){
        return this.name;
    }

    setType(newType){
        this.typeFirst = newType; 
    }

    getType(){
        return this.typeFirst;
    }
    
    printTable(){
        this.transitionTbl.forEach(e => {
            console.log(e['state'] + ' ' + e['transition']);
        });
    }

    /****************************************************************************** */
    // Working with translations.
    /****************************************************************************** */

    addTransition(nextState){
        this.transitionTbl.push(nextState);
        // Reorder array of state transition objects alphabetically.
        this.transitionTbl.sort((a, b) => {
            let symbolA = a.transition.toUpperCase();
            let symbolB = b.transition.toUpperCase();

            if (symbolA < symbolB){
                return -1;
            } else if (symbolA > symbolB) {
                return 1;
            }

            return 0;
        });
        //console.log(this.transitionTbl);
        // New transition grouping needs to be made.
        this.groupedTransitions = this.getGroupedTransitions();
    }

    getTransitions(){
        return this.transitionTbl;
    }

    removeTransition(nextState){
        // Remove state from transitionTbl array. 
    }

    // Groups transtions for a single state.
    getGroupedTransitions(){
        return this.transitionTbl.reduce((acc, cur) => {
            acc[cur.state] = acc[cur.state] || [];
            acc[cur.state].push(cur);
            return acc;
        }, Object.create(null));
    }

    getGroupedStates(){
        return this.transitionTbl.reduce((acc, cur) => {
            acc[cur.transition] = acc[cur.transition] || [];
            acc[cur.transition].push(cur);
            return acc;
        }, Object.create(null));
    }

    /****************************************************************************** */
    // Rendering and rerendering state diagrams.
    /****************************************************************************** */

    insideCircle(event){
        //console.log('in insideCircle function');
        let a = this.x + this.canvasOffsetX - event.clientX;
        let b = this.y - this.canvasOffsetY - event.clientY;
        let d = Math.sqrt(a*a + b*b);
        //console.log(this.name + ' ' + d);
        
        if (d < this.r){
            //console.log('inside ' + this.name);
            return true;
        }
        return false;
    }

    // Draws circle in a new position.
    drawCircle(event, ctx){
        //console.log("in State drawing circle");
        // If body { overflow: hidden } in css use
        //this.x = event.clientX - this.canvasOffsetX + 20;

        this.x = event.clientX - this.canvasOffsetX;
        this.y = event.clientY - this.canvasOffsetY;
        //console.log(`new coord: ${this.x}, ${this.y}`); 
        
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        // Draws circle.
        ctx.arc(
            this.x, 
            this.y, 
            this.r, 
            0, 
            2 * Math.PI
        );
        // Draws text inside circle.
        ctx.textAlign = 'center';
        ctx.textBasline = 'middle';
        ctx.font = '20px Arial';
        ctx.fillText(this.name, this.x, this.y + this.textOffset);
        // Fill line
        ctx.stroke();
    }

    // Draws circle in same position.
    redrawCircle(ctx){
        console.log("redraw");
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        // Draws circle.
        ctx.arc(
            this.x, 
            this.y, 
            this.r, 
            0, 
            2 * Math.PI
        );
        // Draws text inside circle.
        ctx.textAlign = 'center';
        ctx.textBasline = 'middle';
        ctx.font = '20px Arial';
        ctx.fillText(this.name, this.x, this.y + this.textOffset);
        // Fill line
        ctx.stroke();
    }

    // Draws state type symbol.
    drawStateType(ctx){
        console.log("state type symbol");
        ctx.lineWidth = this.lineWidth;
        
        if (this.typeFirst === '>'){
            const triangleBottom = 2 * this.r;
            // Draws triangle.
            ctx.beginPath();
            ctx.moveTo(this.x - this.r, this.y);
            ctx.lineTo(this.x - triangleBottom, this.y - this.r);
            ctx.lineTo(this.x - triangleBottom, this.y + this.r);
            ctx.lineTo(this.x - this.r, this.y);
            ctx.stroke();
        } else if (this.typeFirst === '@'){
            // Draws circle.
            ctx.beginPath();
            ctx.arc(
                this.x, 
                this.y, 
                this.r - 6, 
                0, 
                2 * Math.PI
            );
            // Fill line.
            ctx.stroke();
        }   
    }
}