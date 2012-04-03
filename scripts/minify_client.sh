echo "Packaging Anima..."

rm -rf ../deploy
mkdir ../deploy

cat ../www/js/anima.js ../www/js/sound.js ../www/js/renderer.js ../www/js/node.js ../www/js/layer.js ../www/js/scene.js ../www/js/easing.js ../www/js/animator.js ../www/js/canvas.js ../www/js/level.js ../www/js/body.js >> anima.js
/usr/local/lib/node_modules/uglify-js/bin/uglifyjs --max-line-len 1024 --unsafe --output ../deploy/anima.min.js anima.js
cat anima.js ../www/js/main.js >> app.js
/usr/local/lib/node_modules/uglify-js/bin/uglifyjs --max-line-len 1024 --mangle-toplevel --reserved-names "_anima_update" --unsafe --output ../deploy/app.min.js app.js
cp anima.js ../deploy/
rm anima.js
rm app.js
echo "    compressed javascript files"

mkdir ../deploy/resources
cp -R ../www/resources/css ../deploy/resources
cp -R ../www/resources/images ../deploy/resources
cp -R ../www/resources/jqmobile ../deploy/resources
echo "    copied resources"

cp ../www/js/lib/jquery-1.7.2.min.js ../deploy/
cp ../www/js/lib/jquery.mobile-1.1.0-rc.1.min.js ../deploy/
cp ../www/js/lib/mootools-core-1.4.5.js ../deploy/
echo "    copied libraries"

cp ../www/index.html ../deploy
sed -i '' 's/js\/lib\///g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/anima.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/renderer.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/node.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/layer.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/scene.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/easing.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/animator.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/canvas.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/main.js"><\/script>/<script type="text\/javascript" src="app.min.js"><\/script>/g' ../deploy/index.html
echo "    updated index.html"
echo "    OK!"
