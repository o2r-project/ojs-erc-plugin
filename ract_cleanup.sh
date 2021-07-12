sudo rm -r build
cd test
sudo docker-compose down -v
cd ..
php -r 'clearstatcache();'
echo 3 > /proc/sys/vm/drop_caches
docker exec  act-CI-test-with-cypress-build-OJS echo 3 > sudo /proc/sys/vm/drop_caches