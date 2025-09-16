#!/bin/bash

start_or_run() {
    docker inspect crawler_rabbitmq > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "Starting existing RabbitMQ container..."
        docker start crawler_rabbitmq
    else echo "RabbitMQ container not found. Creating a new one..."
        docker run -d --name crawler_rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    fi    
}

case "$1" in
    start)
        start_or_run
        ;;
    stop)
        echo "Stopping RabbitMQ container..."
        docker stop crawler_rabbitmq
        ;;
    restart)
        echo "Restarting RabbitMQ container..."
        docker restart crawler_rabbitmq
        ;;
    status)
        docker ps -a | grep crawler_rabbitmq
        ;;
    logs)
        echo "Fetching logs for RabbitMQ container..."
        docker logs -f crawler_rabbitmq
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac