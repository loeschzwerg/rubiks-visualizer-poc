# Cube Visualization

Rubik's Cubes are cool, but I couldn't find a simple implementation of
the underlying turning logic.

[Try it →](https://loeschzwerg.github.io/rubiks-visualizer-poc/)

The functionality is documented, but the basic idea is to have a simple
cube-object with strings as their colors, having the cube in the following
representation:
```JavaScript
var cube = {
    yellow: ["yellow","yellow",...], // 9 entries
    blue: side("blue"),
    red: side("red"),
    green: side("green"),
    white: side("white"),
    orange: side("orange")
}
```

The turns are divided into 2 stages:
* Turn the current face
  * *trivial* permutation
* Move the top slices of adjoint faces
  * simulate a stateful turn of adjoint arrays to the current face
  * swap the content of the (0,1,2)-slices (counter-)clockwise
  * turn adjoint faces back