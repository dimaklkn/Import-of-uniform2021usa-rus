console.log("GOOD EVENING!");

getData();

async function getData() {
  //extracting data from rawtable.json
  const response = await fetch("./rawtable.json");
  const rawData = await response.json();

  //making uniq only array values
  let firstArray = [];
  for (let i = 0; i < rawData.length; i++) {
    firstArray.push(rawData[i]["customs cost"]);
  }
  let uniqArray = [...new Set(firstArray)];

  //defining array of objects for each cost parameter
  let batchArray = [];
  for (let i = 0; i < uniqArray.length; i++) {
    let batch = new Batch(uniqArray[i]);
    batchArray.push(batch);
  }

  for (let i = 0; i < batchArray.length; i++) {
    for (let j = 0; j < rawData.length; j++) {
      if (batchArray[i]["cost"] == rawData[j]["customs cost"]) {
        batchArray[i]["trademarks"].push(rawData[j]["trademark"]);
        batchArray[i]["importer"] = rawData[j]["importer"];
        batchArray[i]["date"] = rawData[j]["date"];
      }
    }
  }

  const sortedByImporter = groupBy(batchArray, "importer");
  const arrayByImporter = [];
  for (const key in sortedByImporter) {
    arrayByImporter.push(sortedByImporter[key]);
  }
  console.log(arrayByImporter);

  for (let i = 0; i < arrayByImporter.length; i++) {
    const para = document.createElement("p");
    const node = document.createTextNode(
      i + 1 + " " + arrayByImporter[i][0]["importer"]
    );
    para.appendChild(node);

    const result = document.getElementById("result");
    result.appendChild(para);
    var btn = document.createElement("BUTTON");
    var info = document.createTextNode("Click for information");
    btn.appendChild(info);
    result.appendChild(btn);

    btn.addEventListener("click", function (event) {
      let totalCost = 0;
      let importer = "";
      for (let j = 0; j < arrayByImporter[i].length; j++) {
        let cost = parseInt(arrayByImporter[i][j]["cost"]);
        totalCost += cost;
        importer = arrayByImporter[i][j]["importer"];
      }
      const para = document.createElement("p");

      const node = document.createTextNode(
        importer +
          " Количество поставок: " +
          arrayByImporter[i].length +
          ", Сумма: " +
          totalCost +
          " руб."
      );
      para.appendChild(node);
      const info = document.getElementById("info");
      info.appendChild(para);
    });
  }
}

function groupBy(array, key) {
  const newObj = array.reduce(function (acc, currentValue) {
    if (!acc[currentValue[key]]) {
      acc[currentValue[key]] = [];
    }
    acc[currentValue[key]].push(currentValue);
    return acc;
  }, {});
  return newObj;
}
