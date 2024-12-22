import DirectedAcyclicGraph from "./DirectedAcyclicGraph"; 
import Matrix from "./Matrix";

console.log("\n\n ================== \n");
/*
const input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
*/
/*
 *  01234567
 *  ________ 
(0) 89010123
(1) 78121874
(2) 87430965
(3) 96549874
(4) 45678903
(5) 32019012
(6) 01329801
(7) 10456732
*/

const input = `3212345678121056780310106543218765210109876
7301106769012349891210237858909650987212345
8943219878734217894354345997434501896398730
7654306765025606765969876786521432345485621
1233456834110715610870945431010676541014678
0321067923230894320101234894321289239823549
7450478810301129831230128765045658178101630
8964329234532034761945219652136789017652721
7875012187645695610876106543221054787243890
4976701094556786921065987233234565692104323
3289898763216547836976856100149874563495414
4122305603407436545885445765454703454386901
5001414512518921056794039870363212325677842
6980523347676545121603128981278101210543234
7879601258989236730512789974329892105601100
0968708769076107845676697865012783416782321
1651219940145045912389546521323676545699450
2340367831231236705489030430654541236598769
4565456328900987876018121046543010167894378
3678995417811432980127630198672187098765298
2980987606321501676534548767981096523030167
1011876545450650101456759854102345614123454
9872345034968763212321876543201298705323456
8960101123879454789410989812120398676311237
1051211012567345673508989401032367985200398
2340349873498212232679876501001456810123478
1232456780341000141089845432132345210194569
0541542191232567657897894012201106761087654
5670233088943498766501703025672239872398743
4589104567652567898432612134984346765489232
5498010988961043765430543210789655159896101
4321023870870152896321432323658705014765012
2349834561431161067816521874503216723454101
1056767652521078154907890963212345894323221
0148988943652189143878903454503454513411230
3297803456789321012363212367696543201500549
4586912369878934101454201008987012102676678
5675001078767765210323123412108991343989654
6784100981059874349014056503234780256978703
7693201452342103458005347854345650107869012
8543542367033012567176218961259654398054327
9232632198124988943287307870568765212167898
0101789087235677656896478969876890103456787`;

console.log("\n   === input ===");
console.log(input);

const map = new Matrix(input.split("\n").map((line) => line.split("").map((n) => Number(n))));

const graph = new DirectedAcyclicGraph();
const neighborhood = map.neighborhoodCardinal(0, 0);

for (let i = 0; i < map.height; i++) {
    for (let j = 0; j < map.width; j++) {
        const here = [i, j];
        const hereValue = map.entry(...here);
        const neighborhood = map.neighborhoodCardinal(...here);
        for (const neighbor of neighborhood) {
            if (hereValue === map.entry(...neighbor) - 1) {
                console.log(`[here]: ${here} [entry]: ${hereValue}  //  [there]: ${neighbor}, [entry]: ${map.entry(...neighbor)}`);
                graph.addEdge(JSON.stringify(here), JSON.stringify(neighbor));
            }
        }
    }
}

const trailheads = map.allOccurencePositions(0);
const trailtails = map.allOccurencePositions(9);
const validPathCounts = new Map();
for (const trailhead of trailheads) {
    const startNode = JSON.stringify(trailhead);
    let count = 0;
    for (const tail of trailtails) {
        const endNode = JSON.stringify(tail);
        if (graph.pathExists(startNode, endNode)) {
            count++;
        }
    }
    validPathCounts.set(startNode, count);
}

let sum = 0;
for (const [node, count] of validPathCounts) {
    sum = sum + count;
}

console.log("part 1 solution: ", sum); // solution to part 1

const list = graph.topologicalSort();

const numberOfPaths = (source, dest) => {
    // we're fucking up somewhere, getting NaN on these.
    const slicedList = list.slice(list.indexOf(source), list.indexOf(dest) + 1);
    const paths = Array(slicedList.length).fill(Infinity);
    const len = paths.length - 1;
    paths[len] = 1;

    const helper = (DP, i) => {
        if (i > len) {
            return 0;
        }

        if (DP[i] != Infinity) {
            return DP[i];
        }

        DP[i] = 0;

        for (const neighbor of graph.getNode(slicedList[i])) {
            const neighborIndex = slicedList.indexOf(neighbor);
            const next = helper(DP, neighborIndex);
            DP[i] = DP[i] + next;
        }
        return DP[i];
    }

    return helper(paths, 0);
}

/*
const ratingsMap = new Map();
for (const trailhead of trailheads) {
    const source = JSON.stringify(trailhead);
    let sum = 0;
    for (const tail of trailtails) {
        const dest = JSON.stringify(tail);
        sum = sum + numberOfPaths(source, dest);
    } 
    ratingsMap.set(source, sum);
}
*/

const paths = (source, dest) => {
    let sum = 0;
    const visited = {};
    const DFS = (v) => {
        visited[v] = true;    
        for (const neighbor of graph.getNode(v)) {
            if (neighbor === dest) {
                sum++
            }
            if (visited[neighbor]) {
               // return;
            }
            DFS(neighbor);
        }
    }
    DFS(source);
    return sum;
}

const pathRating = (source) => {
    const destinations = map.allOccurencePositions(9).map((pos) => JSON.stringify(pos));
    let sum = 0;
    for (const dest of destinations) {
        const pathCount = paths(source, dest);
        // console.log(source, dest, sum, pathCount);
        sum = sum + pathCount
    }
    return sum;
}

console.log(pathRating('[0,2]'));

const sources = map.allOccurencePositions(0).map((pos) => JSON.stringify(pos));
let ratingsSum = 0;
for (const source of sources) {
    ratingsSum += pathRating(source);
}
console.log(ratingsSum);

