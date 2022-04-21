#!/bin/sh
version=$(cat ./extension/manifest.json | egrep -o "([0-9]{1,}\.)+[0-9]{1,}")
zip_version="${version/./_}"
firefox_output=./deployments/Firefox_v$zip_version.zip
chrome_output=./deployments/Chrome_v$zip_version.zip
manifest_location=./deployments/manifest.json

zip -j $firefox_output ./extension/* -x *.json
yes | cp ./extension/manifest-firefox.json $manifest_location
zip -j $firefox_output $manifest_location

zip -j $chrome_output ./extension/* -x *.json
yes | cp ./extension/manifest-chrome.json $manifest_location
zip -j $chrome_output $manifest_location