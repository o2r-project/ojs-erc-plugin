perl -i  -0pe  's/(<\?php)\n\W*\n/$1\n ini_set\("max\_execution\_time", "0"\);\n ini_set\("memory\_limit", "128M"\);\n/g' ojsErcPlugin.inc.php
act
sudo docker rm cypress-docker
perl -i  -0pe  's/(<\?php)\n ini_set\("max\_execution\_time", "0"\);\n ini_set\("memory\_limit", "128M"\);\n/$1\n\n/g' ojsErcPlugin.inc.php
