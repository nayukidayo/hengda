## 恒驰汽车计量表

image
```sh
docker build -t nayukidayo/hengda:0.1 . 
```

compose.yaml
```yaml
services:
  hengda:
    restart: always
    image: nayukidayo/hengda:0.1
    logging:
      driver: local
    ports:
      - "51824:51824"
    environment:
      - HTTP_HOST=
      - HTTP_PORT=
      - HTTP_PATH=

```
