const { exec } = require("child_process");
const { join } = require("path");
const { readFileSync, writeFileSync, unlinkSync } = require("fs");

(async () => {
  const cdkOutputsFile = join(__dirname, `tmp.${Math.ceil(Math.random() * 10 ** 10)}.json`);
  const configEnv = join(__dirname, "..", "frontend", ".env");

  try {
    const execProcess = exec(`yarn cdk deploy --outputs-file ${cdkOutputsFile}`, {
      cwd: join(__dirname, "..", "infra"),
    });
    execProcess.stdout.pipe(process.stdout);
    execProcess.stderr.pipe(process.stderr);
    await new Promise((resolve) => {
      execProcess.on("exit", resolve);
    });
  } catch (error) {
    console.log(`cdk command failed: ${error}`);
  }

  // Populate frontend config with data from outputsFile
  try {
    const cdkOutput = JSON.parse(readFileSync(cdkOutputsFile))["aws-sdk-js-notes-app"];
    const config = {
      VITE_FILES_BUCKET: cdkOutput.FilesBucket,
      VITE_GATEWAY_URL: cdkOutput.GatewayUrl,
      VITE_IDENTITY_POOL_ID: cdkOutput.IdentityPoolId,
      VITE_REGION: cdkOutput.Region,
    };
    writeFileSync(
      configEnv,
      Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    );
  } catch (error) {
    console.log(`Error while updating .env: ${error}`);
  }

  // Delete outputsFile
  unlinkSync(cdkOutputsFile);
})();
