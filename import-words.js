const fs = require("fs");
const readline = require("readline");

// Function to read every line of a file into an array
async function readLinesToArray(filePath) {
  const lines = [];
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lines.push(line);
  }

  return lines;
}

// Function to serialize array data into a binary file
function arrayToBinaryFile(array, fileName) {
  let shuffled = shuffleArray(array);
  // Convert array to Uint8Array
  const uint8Array = new Uint8Array(Buffer.from(JSON.stringify(shuffled)));

  // Write the Uint8Array data to a file
  fs.writeFileSync(fileName, uint8Array);
}

// Example usage: Read lines from a file and save them to a binary file
const outputFile = "output.json";

readLinesToArray(
  "/home/rodrigo/Downloads/94f3c0303ba6a7768b47583aff36654d-d9cddf5e16140df9e14f19c2de76a0ef36fd2748/wordle-La.txt"
)
  .then((lines) => {
    arrayToBinaryFile(lines, outputFile);
    console.log("Lines have been read and saved to binary file successfully.");
  })
  .catch((error) => {
    console.error("Error reading lines from file:", error);
  });

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
