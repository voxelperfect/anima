#
# Copyright 2012 Kostas Karolemeas
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#

echo "Packaging Anima..."

rm -rf ../deploy
mkdir ../deploy

cat ../www/js/anima.js ../www/js/sound.js ../www/js/renderer.js ../www/js/node.js ../www/js/layer.js ../www/js/scene.js ../www/js/easing.js ../www/js/animator.js ../www/js/canvas.js ../www/js/level.js ../www/js/body.js ../www/js/ext/score.js ../www/js/ext/slideshow.js >> anima.js
/usr/local/lib/node_modules/uglify-js/bin/uglifyjs --max-line-len 1024 --unsafe --output ../deploy/anima.min.js anima.js
cp anima.js ../deploy/
rm anima.js
echo "    compressed javascript files"

mkdir ../deploy/resources
cp -R ../www/resources/css ../deploy/resources
cp -R ../www/resources/images ../deploy/resources
cp -R ../www/resources/jqmobile ../deploy/resources
cp -R ../www/resources/sounds ../deploy/resources
cp -R ../www/resources/swf ../deploy/resources
echo "    copied resources"

mkdir ../deploy/js
cp -R ../www/js/lib ../deploy/js
echo "    copied libraries"

echo "    OK!"
