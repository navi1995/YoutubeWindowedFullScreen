#!/bin/sh
rm -rf deployments
mkdir deployments
version=$(cat ./extension/manifest.json | egrep -o "([0-9]{1,}\.)+[0-9]{1,}")
zip_version="${version/./_}"
firefox_output=./deployments/Firefox.zip
chrome_output=./deployments/Chrome.zip
manifest_location=./deployments/manifest.json
sed_option=

if [[ "$OSTYPE" == "darwin"* ]]; then
	sed_option='-i ""'
else
	sed_option='-i'
fi

zip -j $firefox_output ./extension/* -x *.json
yes | cp ./extension/manifest-firefox.json $manifest_location
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
else
  sed -i -e 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
fi
zip -j $firefox_output $manifest_location

zip -j $chrome_output ./extension/* -x *.json
yes | cp ./extension/manifest-chrome.json $manifest_location
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
else
  sed -i -e 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
fi
zip -j $chrome_output $manifest_location