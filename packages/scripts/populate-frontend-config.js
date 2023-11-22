const { exec } = require("child_process");
const { join } = require("path");
const { readFileSync, writeFileSync, unlinkSync } = require("fs");

const isLocal = process.argv.includes("--local");

(async () => {
  const cdkOutputsFile = join(
    __dirname,
    `tmp.${Math.ceil(Math.random() * 10 ** 10)}.json`
  );
  const configFile = join(__dirname, "..", "frontend", ".env");

  try {
    const deployCommand = isLocal ? "yarn cdklocal deploy --outputs-file" : "yarn cdk deploy --outputs-file";
    const execProcess = exec(
      `${deployCommand} ${cdkOutputsFile}`,
      {
        cwd: join(__dirname, "..", "infra"),
      }
    );
    execProcess.stdout.pipe(process.stdout);
    execProcess.stderr.pipe(process.stderr);
    await new Promise((resolve) => {
      execProcess.on("exit", resolve);
    });
  } catch (error) {
    console.log(`Deploy failed: ${error}`);
  }

  // Populate frontend config with data from outputsFile
  try {
    const cdkOutput = JSON.parse(readFileSync(cdkOutputsFile))[
      "aws-sdk-js-notes-app"
    ];
    const envContent = `
    VITE_FILES_BUCKET=${cdkOutput.FilesBucket}
    VITE_GATEWAY_ID=${cdkOutput.GatewayId}
    VITE_IDENTITY_POOL_ID=${cdkOutput.IdentityPoolId}
    VITE_REGION=${cdkOutput.Region}
    VITE_BASE_URL=/cloudfront/${cdkOutput.FrontendDistributionId}/
    `;
        writeFileSync(configFile, envContent);
  } catch (error) {
    console.log(`Error while updating env: ${error}`);
  }

  // Delete outputsFile
  unlinkSync(cdkOutputsFile);
})();
