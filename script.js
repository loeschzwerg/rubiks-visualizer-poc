const yellow = "yellow";
const red = "red";
const white = "white";
const orange = "orange";
const blue = "blue";
const green = "green";


/**
 * Build an array with nine entries. This represents one side of the cube.
 * @param {String} color
 * @return {Array} - [@color, @color, ...]
 */
function side(color) {
    let side_arr = [];
    for (let i = 0; i < 9; i++) {
        side_arr[i] = color;
    }
    return side_arr;
}

/**
 * The stateful cube object
 */
var cube = {
    yellow: side("yellow"),
    blue: side("blue"),
    red: side("red"),
    green: side("green"),
    white: side("white"),
    orange: side("orange")
}

/**
 * Define how a turn affects a cube side.
 * @const id: No changes
 * @const cw: Turn a side clockwise
 * @const dcw: Turn a side double clockwise, or 180 degree
 * @const ccw: Turn a side counter-clockwise
 */
const id = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 0 degree
const cw = [6, 3, 0, 7, 4, 1, 8, 5, 2]; // 90 degree
const dcw = [8, 7, 6, 5, 4, 3, 2, 1, 0]; // 180 degree
const ccw = [2, 5, 8, 1, 4, 7, 0, 3, 6] // -90 / 270 degree


/**
 * Because every side touches differently indexed array portions when viewed
 * on as top, change the rotation of these sides as a temporary measure, 
 * so turns are always on the leading indexes (0,1,2) for less brain damage:
 * (compare red)
 *   6 7 8          0 1 2  
     -----          -----  
 * 2|0 1 2|0      0|0 1 2|0
 * 5|3 4 4|3  ->  1|3 4 5|1
 * 8|6 7 8|6      2|6 7 8|2
 *   -----          -----  
 *   0 1 2          0 1 2  
 */
const turns = {
    yellow: [[dcw, "orange"], [id, "green"], [id, "red"], [id, "blue"]],
    red: [[dcw, "yellow"], [cw, "green"], [id, "white"], [ccw, "blue"]],
    white: [[dcw, "red"], [dcw, "green"], [id, "orange"], [dcw, "blue"]],
    orange: [[dcw, "white"], [ccw, "green"], [id, "yellow"], [cw, "blue"]],
    blue: [[cw, "yellow"], [cw, "red"], [cw, "white"], [cw, "orange"]],
    green: [[ccw, "yellow"], [ccw, "orange"], [ccw, "white"], [ccw, "red"]]
}

/***************************************************
 * Actual algorithm
 ***************************************************
 */

/**
 * Usability function
 * Arrays are hard to read, so convert a direction array to a string 
 * @param {Array} direction
 * @returns {String} of the corresponding movement
 */
function dir_str(direction) {
    return direction == id ? "id" : direction == cw ? "cw" : direction == dcw ? "dcw" : "ccw"
}

/**
 * Rotate a side in a direction.
 * Creates a copy of the side, so the cube reference is not overwriting itself.
 * JavaScript is ugly with references over values, so be careful what to do.
 * @param {Array} direction - (id, cw, dcw, ccw)
 * @param {Array} color - the key of the color of the cube-side
 */
function rotate(direction, color) {
    console.log("rotate", color, dir_str(direction))
    let copy = { ...cube[color] }
    for (let i = 0; i < 9; i++) {
        cube[color][i] = copy[direction[i]]
    }
}

/**
 * ATTENTION: always use unfocus_side after stateful permutations
 * Rearrange the contents of all sides, such that one color is focused
 * @param {Array} turns 
 */
function focus_side(turns) {
    for (const side of turns) {
        rotate(side[0], side[1])
    }
}

/**
 * ATTENTION: always use focus_side before stateful permutations
 * Rearrange the focused side to the initial arrangements.
 * Basically focus + unfocus = id
 * @param {Array} sides
 */
function unfocus_side(sides) {
    for (const side of sides) {
        switch (side[0]) {
            case cw: rotate(ccw, side[1]); break;
            case ccw: rotate(cw, side[1]); break;
            case dcw: rotate(dcw, side[1]); break;
            case id: rotate(id, side[1]); break;
        }
    }
}

/**
 * Move the (0,1,2)-Contents of @above @right @below and @left in (counter-) @clockwise direction
 * @param {Array} above 
 * @param {Array} right 
 * @param {Array} below 
 * @param {Array} left 
 * @param {Boolean} clockwise 
 */
function swap_top_row(above, right, below, left, clockwise) {
    let old = [above.slice(0, 3), right.slice(0, 3), below.slice(0, 3), left.slice(0, 3)];
    console.log("top row:", old)
    if (!clockwise) {
        for (let i = 0; i < 3; i++) {
            [above[i], right[i], below[i], left[i]] = [old[1][i], old[2][i], old[3][i], old[0][i]]
        }
    } else {
        for (let i = 0; i < 3; i++) {
            [above[i], right[i], below[i], left[i]] = [old[3][i], old[0][i], old[1][i], old[2][i]]
        }
    }
}

/**
 * Algorithm to turn a side:
 * 1. Rotate face
 * 2.1. arrange adjoining faces
 * 2.2. swap top rows (counter-)clockwise
 * 2.3. arrange adjoining faces
 * @param {side} color 
 * @param {Boolean} clockwise 
 */
function turn_face(color, clockwise) {
    let [above, right, below, left] = turns[color];
    rotate(clockwise ? cw : ccw, color);
    focus_side([above, right, below, left]);
    swap_top_row(cube[above[1]], cube[right[1]], cube[below[1]], cube[left[1]], clockwise);
    unfocus_side([above, right, below, left])
}

/**
 * -> Entrypoint to the algorithm.
 * Turns the var cube on side @color @clockwise or counterclockwise (true/false).
 * No other actions are applicable on that physical system "cube".
 * @param {side} color 
 * @param {Boolean} clockwise 
 */
function turn_cube(color, clockwise) {
    console.log("-> turn", color, clockwise ? "clockwise" : "counterclockwise");
    turn_face(color, clockwise);
    render_cube();
}


/********************************************
 * HTML stuff, because humans can't view code
 ********************************************
 */
function html_table_row(color, offset) {
    return "<tr>" +
        "<th id=\"" + color + offset + "\" class=\"" + cube[color][offset] + "\">" + offset + "</th>" +
        "<th id=\"" + color + (offset + 1) + "\" class=\"" + cube[color][offset + 1] + "\">" + (offset + 1) + "</th>" +
        "<th id=\"" + color + (offset + 2) + "\" class=\"" + cube[color][offset + 2] + "\">" + (offset + 2) + "</th>" +
        "</tr>";
}

function html_table_init(color) {
    return "<table>" +
        html_table_row(color, 0) +
        html_table_row(color, 3) +
        html_table_row(color, 6) +
        "</table>";
}

function render_cube() {
    var sides = document.getElementsByClassName("side")
    for (const side in sides) {
        if (Object.hasOwnProperty.call(sides, side)) {
            const s = sides[side];
            const color_class = s.id;
            s.innerHTML = html_table_init(s.id);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

render_cube();