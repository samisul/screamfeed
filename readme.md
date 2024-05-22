### Screenshots

![1](./.github/screenshots/1.png)
![2](./.github/screenshots/2.png)
![3](./.github/screenshots/3.png)
![4](./.github/screenshots/4.png)

### Features

- [x] add/remove feeds
- [x] view feeds you have added
- [x] export feeds
- [x] import feeds
- [x] mark feed items & view them
- [x] list available feeds added by other users
- [x] search feeds
- [x] categorize feeds
- [ ] snapshot item as image
- [x] tool to fetch rss feeds from popular websites (e.g. reddit, youtube, etc.)
- [x] settings menu to hide stuff like search bar, mark button, mark page, etc.
      **_... more to come ..._**

### Self-hosting

```bash
$ curl -o .env "https://raw.githubusercontent.com/samisul/screamfeed/dev/.example.env" && curl -o docker-compose.yaml "https://raw.githubusercontent.com/samisul/screamfeed/dev/docker-compose.prod.yaml"
$ docker-compose up -d # after editing .env
```

> name inspired by [Archspire - Scream Feeding](https://www.youtube.com/watch?v=xg8OPdc0wI8) <3
