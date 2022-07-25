#!/bin/sh
rm -rf deployments
mkdir deployments
mkdir deployments/Firefox/
version=$(cat ./extension/manifest.json | egrep -o "([0-9]{1,}\.)+[0-9]{1,}")
firefox_output=./deployments/Firefox/
chrome_output=./deployments/Chrome.zip
manifest_location=./deployments/manifest.json

cp -r ./extension/* $firefox_output
rm -rf $firefox_output/*.json
cp ./extension/manifest-firefox.json $manifest_location
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
else
  sed -i -e 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
fi
cp $manifest_location $firefox_output

zip -j $chrome_output ./extension/* -x *.json
yes | cp ./extension/manifest-chrome.json $manifest_location
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
else
  sed -i -e 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
fi
zip -j $chrome_output $manifest_location
