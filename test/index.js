const swicw = require("..");
const Arweave = require("arweave");
const smartweave = require("smartweave");
const fs = require('fs');

// 9BX6HQV5qkGiXV6hTglAuPdccKoEP_XI2NNbjHv5MMM main contract
// 0Z4z_Z6tLza640a9aB6Y4wsUHO80i2JAgOa5rZZ7TsA new task contract
const CONTRACT_ID = "IpEKWpnCCa09-fALeXsQmVD_UYHCuyblVpgPOrsMXEM"; // old task contract

async function main() {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    logging: false,
    timeout: 60000
  });

  console.log("Reading recursive contract with smartweave");
  const t1 = new Date();
  const res1 = await smartweave.readContract(
    arweave,
    CONTRACT_ID
  );
  const t2 = new Date();
  console.log(`Done in ${t2 - t1}\n\nReading recursive contract with swicw`);

  const res2 = await swicw.readContract(
    arweave,
    CONTRACT_ID
  );
  const t3 = new Date();
  console.log(`Done in ${t3 - t2}\n\nRereading recursive contract with swicw (should now be cached)`);

  const res3 = await swicw.readContract(
    arweave,
    CONTRACT_ID
  );
  const t4 = new Date();
  console.log(`Done in ${t4 - t3}`);

  console.log("\nswicw matches SmartWeave?", JSON.stringify(res1) === JSON.stringify(res2));

  console.log("\nswicw1 matches swicw2?", JSON.stringify(res3) === JSON.stringify(res2));

  await writeOutput(1, res1);
  await writeOutput(2, res2);
  await writeOutput(3, res3);
}

main().then(() => console.log("Terminated"));

async function writeOutput (num, data) {
  var outputFile = __dirname + "/" + num + ".json";
  var json = JSON.stringify(data);
  fs.writeFile(outputFile, json, {}, function (err, res) {
    if (err) console.error("output write " + num + " failed with error ", err);
    console.log("write succeeded for " + num, res);
  });

}