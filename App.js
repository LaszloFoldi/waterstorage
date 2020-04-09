const createView = () => {
    const container = document.getElementById("container");
    container.innerHTML = "";

    let resultHead = document.createElement("H3");
    resultHead.id = "result"
    container.appendChild(resultHead);

    let inputContainer = document.createElement("DIV");
    inputContainer.id = "input-container";
    inputContainer.innerHTML = "Column heights: ";

    let inputBox = document.createElement("INPUT");
    inputBox.id = "input1";
    inputContainer.appendChild(inputBox);
    
    container.appendChild(inputContainer);

    let flexContainer = document.createElement("DIV");
    flexContainer.id = "flex-container";

    container.appendChild(flexContainer);
}

(() => {
    createView();

    document.querySelector("body").addEventListener("keyup", event => {
        if(event.keyCode == 46 && event.target === event.currentTarget) {
            resetView(true);
        }
    });

    document.getElementById('input1').addEventListener('keyup', (event) => {
        if(event.keyCode == 13) {
            resetView(false);
            let numbers = event.target.value.match(/\d+/g).map(Number);
            if(numbers.length > 30) {
                console.log("HIBA: Maximum 30 oszlop engedélyezett.");
                return;
            } else if(Math.max(...numbers) > 30) {
                console.log("HIBA: Maximum oszlopmagasság (30) túllépve.");
                return;
            }
            let columns = [];

            let totalWaterVolume = 0;
            
            let indexedMaxHeights = getIndexedMaxHeights(numbers);
            numbers.forEach((element, index) => {
                let localWaterLevel = Math.min(indexedMaxHeights.h1[index], indexedMaxHeights.h2[index]);
                let localWaterHeight = localWaterLevel - element;
                totalWaterVolume += localWaterHeight;
                columns = [...columns, generateColumn(index, element, localWaterHeight),];
            });
            draw(columns);
            giveAnswer(totalWaterVolume);
        }     
    });
})();

const getIndexedMaxHeights = (heightMap) => {
    let ret = {
        h1: [heightMap[0]],
        h2: []
    };
    ret.h2[heightMap.length - 1] = heightMap[heightMap.length - 1];
    for(let i = 1; i < heightMap.length; i++) {
        ret.h1 = [...ret.h1, Math.max(ret.h1[i-1], heightMap[i])];
        
        let correctedIndex = heightMap.length - (1 + i);
        ret.h2[correctedIndex] = Math.max(heightMap[correctedIndex], ret.h2[correctedIndex+1]);
    } 

    return ret;
};

const generateColumn = (colIndex, height, waterHeight) => {
    let column = {
        htmlElement: "DIV",
        id: ("flex-item_" + colIndex),
        cssClass: "flex-item",
        height: height,
        index: colIndex,
        blocks: [
            {
                htmlElement: "DIV",
                cssClass: "ground"
            },
            {
                htmlElement: "DIV",
                content: colIndex
            }
        ]
    };

    // Generate blocks
    for(let i = 0; i < height; i++) {
        column.blocks = [
            {
                htmlElement: "DIV",
                cssClass: "block"
            },
            ...column.blocks,
        ]
    }

    //generate water
    for(let i = 0; i < waterHeight; i++) {
        column.blocks = [
            {
                htmlElement: "DIV",
                cssClass: "water"
            },
            ...column.blocks,
        ];        
    }

    return column;
}

const draw = (drawable) => {
    if(!Array.isArray(drawable)) {
        console.log("Drawable is not an array.");
        return;
    }
    
    const colContainer = document.getElementById("flex-container");
    drawable.forEach(element => {
        let colElement = document.createElement(element.htmlElement);
        colElement.classList.add(element.cssClass);
        colElement.id = element.id;
        element.blocks.forEach(innerElement => {
            let colBlock = document.createElement(innerElement.htmlElement);
            if(innerElement.cssClass) colBlock.classList.add(innerElement.cssClass);
            colBlock.innerHTML = innerElement.content ?? '';
            colElement.appendChild(colBlock);
        });

        colContainer.appendChild(colElement);
    });
}

const giveAnswer = (answer) => {
    document.getElementById("result").innerHTML = answer;
}

const resetView = (hardReset) => {
    document.getElementById("flex-container").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    if(hardReset) document.getElementById("input1").value = "";
}