// THANKS TO: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
// for createRandomGenerator, which is mulberry32(a)

 function createRandomGenerator(seed) {
    var a = parseInt(seed);
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

 function randInt(fRandom, rMin, rMax) {
    var randomFrac = fRandom();
    var result = Math.trunc((rMax - rMin + 1) * randomFrac + rMin);
    return result;
    
}

function shuffleArray(arr, fRandom) {
    return shuffleHelper(fRandom, arr, []);
}

 function shuffleHelper(fRandom, eltArray, outArray) {
    if (eltArray.length == 0) { 
        return outArray; 
    }

    var swapDigit = randInt(fRandom, 0, eltArray.length - 1);
    var selected = eltArray[swapDigit];
    eltArray[swapDigit] = eltArray[eltArray.length - 1];
    outArray.push(selected);
    eltArray.pop();
    return shuffleHelper(fRandom, eltArray, outArray);
}

// Note: This whole thing is hardcoded to 10 so let's keep it magic.
// The "public" function
function positionToScoreFromSeed(seed) {
    var fRandom = createRandomGenerator(seed);
    var homeIndices = shuffleArray([...Array(10).keys()], fRandom);
    var awayIndices = shuffleArray([...Array(10).keys()], fRandom);
    return [homeIndices, awayIndices];
        
}

// This a DIRTY hack to turn an array mappiong like [2,0,1] (0->2, 1->0, 2-> 1) 
// into its inverse: [1,2,0]
// This only works for permutations of 0,1,....n.  
function _dirtyInvert(sequence) {
    return sequence.map((elt, ix) => [elt, ix]).sort().map((pair) => pair[1]);
}

function scoreToPositionFromSeed(seed) {
    var pair = positionToScoreFromSeed(seed);
    var homeIndices = pair[0];
    var awayIndices = pair[1];
    return [_dirtyInvert(homeIndices), _dirtyInvert(awayIndices)];
}
export { positionToScoreFromSeed, scoreToPositionFromSeed };
