version: "3.8"
services:
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - "27018:27017"
    volumes:
      - ./db/:/data/db 
  redis:
    container_name: redis_1
    # image: redis
    image: redislabs/rejson:latest
    ports:
     - "6379:6379"
    # networks:
    #   - my-network
    # volumes:
    #  - ./redis-service/config/redis.conf:/redis.conf 
  redisinsight:
    image: redislabs/redisinsight
    ports:
      - '8001:8001'
    # networks:
    #   - my-network
  rabbitmq:
    image: rabbitmq:3.10-rc-management-alpine
    ports:
      # AMQP protocol port
      - "5672:5672"
      # HTTP management UI
      - "15672:15672"
  products:
    build:
      dockerfile: Dockerfile
      context: ./products
    container_name: products 
    ports:
      - "8002:8002"
    restart: always
    depends_on:         
      - "mongo"
      - "rabbitmq"
    volumes:
      - .:/app 
      - /app/products/node_modules 
    
    env_file:
      - ./products/.env.dev
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
  shopping:
    build:
      dockerfile: Dockerfile 
      context: ./shopping 
    container_name: shopping
    ports:
      - "8003:8003"
    restart: always
    depends_on:
      - "mongo"
    volumes:
      - .:/app 
      - /app/shopping/node_modules 
    env_file:
      - ./shopping/.env
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
  customer:
    build:
      dockerfile: Dockerfile
      context: ./customer 
    container_name: customer
    ports:
      - "8007:8007" 
    restart: always
    depends_on:
      - "mongo" 
      - "redis"
      - "rabbitmq"
    volumes:
      - "./customer:/app/customer" 
      # - /app/customer/node_modules
    # networks:
    #   - my-network
    env_file:
      - ./customer/.env.dev
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    
  nginx-proxy:
    build:
      dockerfile: Dockerfile
      context: ./proxy
    depends_on:
      - products
      - shopping
      - customer
    ports:
      - 80:80
# networks:
#   my-network: