import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

const bucket = process.env.AWS_S3_BUCKET;
const distributionId = process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID;
const region = process.env.AWS_REGION || "us-east-1";

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: root, env: process.env });
}

function requireAwsCli() {
  try {
    execSync("aws --version", { stdio: "pipe" });
  } catch {
    console.error("AWS CLI not found. Install: https://aws.amazon.com/cli/");
    process.exit(1);
  }
}

if (!bucket) {
  console.error("Set AWS_S3_BUCKET environment variable.");
  console.error("Example: AWS_S3_BUCKET=ghazi-restaurant-123456789 npm run deploy:aws");
  process.exit(1);
}

requireAwsCli();

console.log("Building production bundle...");
run("npm run build");

if (!existsSync(distDir)) {
  console.error("Build failed — dist/ folder not found.");
  process.exit(1);
}

console.log(`\nUploading to s3://${bucket} ...`);
run(
  `aws s3 sync dist/ s3://${bucket}/ --delete --region ${region} --cache-control "public,max-age=31536000,immutable" --exclude "index.html" --exclude "_redirects"`
);
run(
  `aws s3 cp dist/index.html s3://${bucket}/index.html --region ${region} --cache-control "public,max-age=0,no-cache,no-store,must-revalidate" --content-type "text/html"`
);

if (existsSync(path.join(distDir, "_redirects"))) {
  run(
    `aws s3 cp dist/_redirects s3://${bucket}/_redirects --region ${region} --content-type "text/plain"`
  );
}

if (distributionId) {
  console.log("\nInvalidating CloudFront cache...");
  run(
    `aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`
  );
} else {
  console.log("\nTip: set AWS_CLOUDFRONT_DISTRIBUTION_ID to clear CDN cache after deploy.");
}

console.log("\nDeploy complete.");
