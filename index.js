import fs from "fs";
import path from "path";
import vrtConfig from "./vrt.config.json" with { type: "json" };

const TEST_OUTPUT_DIR = "./test-results";
const OUTPUT_FOLDER_PREFIX = "example-registration-vrt-";
const { url: PAGE_URL } = vrtConfig;

function browserSection(browserName, result) {
  const mismatch = result ? `${result.misMatchPercentage}` : "N/A";
  return `<div class="browser" id="browser-${browserName}">
    <h2>${browserName} &mdash; Mismatch: ${mismatch}</h2>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Reference (Before)</span>
        <img class="img2" src="before-${browserName}.png" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer">
        <span class="imgname">Test (After)</span>
        <img class="img2" src="after-${browserName}.png" id="testImage" label="Test">
      </div>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Diff</span>
        <img class="imgfull" src="compare-${browserName}.png" id="diffImage" label="Diff">
      </div>
    </div>
  </div>`;
}

function createReport(url, browserSections) {
  return `
    <html>
        <head>
            <title> VRT Report </title>
            <link href="index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Report for
                 <a href="${url}"> ${url}</a>
            </h1>
            <div id="visualizer">
                ${browserSections.join("")}
            </div>
        </body>
    </html>`;
}

if (!fs.existsSync(TEST_OUTPUT_DIR)) {
  console.error(
    `Output directory not found: ${TEST_OUTPUT_DIR}. Run tests first.`,
  );
  process.exit(1);
}

const browserFolders = fs
  .readdirSync(TEST_OUTPUT_DIR)
  .filter((name) => name.startsWith(OUTPUT_FOLDER_PREFIX));

if (browserFolders.length === 0) {
  console.error(
    `No test result folders found matching '${OUTPUT_FOLDER_PREFIX}*'. Run tests first.`,
  );
  process.exit(1);
}

for (const folder of browserFolders) {
  const browserName = folder.replace(OUTPUT_FOLDER_PREFIX, "");
  const outputDir = path.join(TEST_OUTPUT_DIR, folder);
  const resultFile = path.join(outputDir, `result-${browserName}.json`);
  let result = null;
  if (fs.existsSync(resultFile)) {
    result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
  }
  const reportHtml = createReport(PAGE_URL, [
    browserSection(browserName, result),
  ]);
  fs.writeFileSync(path.join(outputDir, "index.html"), reportHtml);
  fs.copyFileSync("./public/index.css", path.join(outputDir, "index.css"));
  console.log(`VRT report generated: ${outputDir}/index.html`);
}
