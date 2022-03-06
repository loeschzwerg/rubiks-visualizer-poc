const yellow = "yellow";
const red = "red";
const white = "white";
const orange = "orange";
const blue = "blue";
const green = "green";

function side(color) {
    let side_arr = [];
    for (let i = 0; i < 9; i++) {
        side_arr[i] = color;
    }
    return side_arr;
}

var cube = {
    yellow: side("yellow"),
    blue: side("blue"),
    red: side("red"),
    green: side("green"),
    white: side("white"),
    orange: side("orange")
}

const id = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const cw = [6, 3, 0, 7, 4, 1, 8, 5, 2];
const dcw = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const ccw = [2, 5, 8, 1, 4, 7, 0, 3, 6]



function dir_str(direction) {
    return direction == id ? "id" : direction == cw ? "cw" : direction == dcw ? "dcw" : "ccw"
}

function rotate(direction, color) {
    console.log("rotate", color, dir_str(direction))
    let copy = { ...cube[color] }
    for (let i = 0; i < 9; i++) {
        cube[color][i] = copy[direction[i]]
    }
}

function align_top(sides) {
    for (const side of sides) {
        rotate(side[0], side[1])
    }
}

function unalign_top(sides) {
    for (const side of sides) {
        switch (side[0]) {
            case cw: rotate(ccw, side[1]); break;
            case ccw: rotate(cw, side[1]); break;
            case dcw: rotate(dcw, side[1]); break;
            case id: rotate(id, side[1]); break;
        }
    }

}

function swap_top_row(above, right, below, left, clockwise) {
    let old = [above.slice(0, 3), right.slice(0, 3), below.slice(0, 3), left.slice(0, 3)];
    console.log("top row:", old)
    if (clockwise) {
        for (let i = 0; i < 3; i++) {
            [above[i], right[i], below[i], left[i]] = [old[1][i], old[2][i], old[3][i], old[0][i]]
        }
    } else {
        for (let i = 0; i < 3; i++) {
            [above[i], right[i], below[i], left[i]] = [old[3][i], old[0][i], old[1][i], old[2][i]]
        }
    }
}

const turns = {
    yellow: [[dcw, "orange"], [id, "green"], [id, "red"], [id, "blue"]],
    red: [[dcw, "yellow"], [cw, "green"], [id, "white"], [ccw, "blue"]],
    white: [[dcw, "red"], [dcw, "green"], [id, "orange"], [dcw, "blue"]],
    orange: [[dcw, "white"], [ccw, "green"], [id, "yellow"], [cw, "blue"]],
    blue: [[cw, "yellow"], [cw, "red"], [cw, "white"], [cw, "orange"]],
    green: [[ccw, "yellow"], [ccw, "orange"], [ccw, "white"], [ccw, "red"]]
}

function turn_face(color, clockwise) {
    let [above, right, below, left] = turns[color];
    rotate(clockwise ? cw : ccw, color);
    align_top([above, right, below, left]);
    swap_top_row(cube[above[1]], cube[right[1]], cube[below[1]], cube[left[1]], clockwise);
    unalign_top([above, right, below, left])
}

function turn_cube(color, clockwise) {
    console.log("-> turn", color, clockwise ? "clockwise" : "counterclockwise");
    turn_face(color, clockwise);
    render_cube();
}

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