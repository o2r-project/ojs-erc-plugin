perl -i  -0pe  's/http:\/\/localhost/http:\/\/ojs/g' build/config.js
perl -i  -0pe  's/http:\/\/localhost:8000/http:\/\/ojs/g' build/index.html
act
sudo docker rm cypress-docker
cd test
sudo docker-compose down -v
cd ..
perl -i  -0pe  's/http:\/\/ojs/http:\/\/localhost/g' build/config.js
perl -i  -0pe  's/http:\/\/ojs/http:\/\/localhost:8000/g' build/index.html