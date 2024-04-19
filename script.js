function indexToCoord(coord, width) {
    let y = Math.floor(coord / width);
    let remainder = (coord / width) % 1;
    let x = remainder * width;
    return [x, y];
}

function distanceBetweenPoints(a, b) {
    let distance = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return distance;
}

function angleBetweenPoints(a, b) {
    let hypotenuse = distanceBetweenPoints(a, b);
    if (hypotenuse !== 0) {
        let opposite = b[1] - a[1];
        let angle = Math.sin(opposite / hypotenuse);
        return angle;
    } else {
        return undefined;
    }
}

let canvas = document.querySelector('canvas');
canvas.width = 100;
canvas.height = 100;
pixels = [];
let c = canvas.getContext('2d');

for (let i=0; i<canvas.width*canvas.height; i++) {
    if (Math.random() < 0.5) {
        pixels.push(true);
    } else {
        pixels.push(false);
    }
}

setInterval(() => {
    for (let i=0; i<canvas.width*canvas.height; i++) {
        if (pixels[i]) {
            c.fillStyle = 'black';
        } else {
            c.fillStyle = 'white';
        }
        let position = indexToCoord(i, canvas.width);
        c.fillRect(position[0], position[1], 1, 1);
    }
    
    let pixelDirections = [];
    
    for (let i=0; i<canvas.width*canvas.height; i++) {
        let pixelI = pixels[i];
        if (pixelI) {
            let pixelIAngles = [];
            let pixelIDistances = [];
            for (let j=0; j<canvas.width*canvas.height; j++) {
                let pixelJ = pixels[j];
                if (pixelJ) {
                    let angle = angleBetweenPoints(indexToCoord(i, canvas.width), indexToCoord(j, canvas.width));
                    pixelIAngles.push(angle);
                    pixelIDistances.push(distanceBetweenPoints(indexToCoord(i, canvas.width), indexToCoord(j, canvas.height)));
                }
            }
            const nanIndex = pixelIAngles.indexOf(undefined);
            pixelIAngles.splice(nanIndex, 1);
            const zeroIndex = pixelIDistances.indexOf(0);
            pixelIDistances.splice(zeroIndex, 1);
            let totalAngle = pixelIAngles.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            let averageAngle = totalAngle / pixelIAngles.length;

            if (averageAngle < 0.125 || averageAngle > 0.825) {
                pixelDirections.push('up');
            } else if (0.125 < averageAngle && averageAngle < 0.375) {
                pixelDirections.push('right');
            } else if (0.375 < averageAngle && averageAngle < 0.625) {
                pixelDirections.push('down');
            } else if (0.625 < averageAngle && averageAngle < 0.825) {
                pixelDirections.push('left');
            } else {
                console.log(averageAngle + ' broke the system');
            }
        }
        console.log('/ ' + canvas.width * canvas.height);
    }
    
    let blackIndex = -1;
    let newPixels = Array(canvas.width*canvas.height).fill(false);
    for (let i=0; i<canvas.width*canvas.height; i++) {
        let selectedPixel = pixels[i];
        let selectedCoord = indexToCoord(i, canvas.width);
        if (pixels[i]) {
            blackIndex++;
            let direction = pixelDirections[blackIndex];
            if (direction === 'up') {
                var indexToMoveTo = i - canvas.width;
            } else if (direction === 'right') {
                var indexToMoveTo = i + 1;
            } else if (direction === 'down') {
                var indexToMoveTo = i + canvas.width;
            } else if (direction === 'left') {
                var indexToMoveTo = i - 1;
            } else {
                var indexToMoveTo = i;
            }

            if (newPixels[indexToMoveTo] === false) {
                newPixels[i] = false;
                newPixels[indexToMoveTo] = true;
            } else {
                if (newPixels[i] === false) {
                    newPixels[i] = true;
                } else {
                    if (newPixels[i+1] === false) {
                        newPixels[i+1] = true;
                    } else {
                        if (newPixels[i+canvas.width] === false) {
                            newPixels[i+canvas.width] = true;
                        } else {
                            newPixels[i-canvas.width] = true;
                        }
                    }
                }
            }
        }
    }
    pixels = newPixels;
}, 1000);