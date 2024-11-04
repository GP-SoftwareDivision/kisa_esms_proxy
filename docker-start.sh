docker stop kisa-dashboard_proxy-container

docker rm kisa-dashboard_proxy-container

docker rmi $(docker images kisa-dashboard_proxy -q)

docker build -t kisa-dashboard_proxy .

docker run --env-file .env -d -p 8080:8080 --name kisa-dashboard_proxy-container kisa-dashboard_proxy