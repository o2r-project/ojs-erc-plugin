#Tests are run and instance is created
act
sudo docker rm cypress-docker
sudo rm -r build

#Cleanup
cd test
sudo docker-compose down -v
cd ..
echo 3 > /proc/sys/vm/drop_caches