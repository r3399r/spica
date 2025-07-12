#!/bin/bash
set -e

env=$1
project=spica
subDomain=bunnybill
domain=celestialstudio.net

echo ====================================================================================
echo env: $env
echo project: $project
echo domain: $subDomain.$domain
echo ====================================================================================

echo deploy backend AWS...
cd ../backend
npm i
npm run pre:deploy
aws cloudformation package --template-file aws/cloudformation/template.yaml --output-template-file packaged.yaml --s3-bucket y-cf-midway-singapore
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project SubDomain=$subDomain Domain=$domain --no-fail-on-empty-changeset --s3-bucket y-cf-midway-singapore --capabilities CAPABILITY_NAMED_IAM
echo ====================================================================================

echo prepare frontend files...
npm run compile
rm -rf ../frontend/src/model/backend
rm -rf ../frontend/src/constant/backend
cp -R lib/src/model ../frontend/src/model/backend
cp -R src/constant ../frontend/src/constant/backend
echo ====================================================================================

# echo prepare api document...
# cd ../doc
# # npm ci
# npm run tsoa -- $env
# echo ====================================================================================

echo deploy frontend to S3...
cd ../frontend
npm i
npm run pre:deploy
# mkdir -p ./dist/doc
# cp -R ../doc/index.* ./dist/doc
aws s3 sync ./dist s3://$project-$env --delete --cache-control no-cache
echo ====================================================================================