#!/bin/sh
version=$(cat ./extension/manifest.json | egrep -o "([0-9]{1,}\.)+[0-9]{1,}")
zip_version="${version/./_}"
firefox_output=./deployments/Firefox.zip
chrome_output=./deployments/Chrome.zip
manifest_location=./deployments/manifest.json

zip -j $firefox_output ./extension/* -x *.json
yes | cp ./extension/manifest-firefox.json $manifest_location
sed -i "" 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
zip -j $firefox_output $manifest_location

zip -j $chrome_output ./extension/* -x *.json
yes | cp ./extension/manifest-chrome.json $manifest_location
sed -i "" 's/\"version\":.*/\"version\": "'${version}'",/g' "${manifest_location}"
zip -j $chrome_output $manifest_location