# Red or Blue Pill - The Game

![Showcase Image](https://i.ibb.co/KVQ3Ch8/Screenshot-1.png)

This is "Red or Blue Pill", a game full of difficult decisions. Will you take the red pill and embrace a adventure? Or will you opt for the blue pill, staying in your comfort zone? The tech stack includes: Node.js, Next.js, Redis, MongoDB & Docker.

<a href="https://redorbluepillgame.com">View Website</a>


## Getting Started
### Prerequisites

- Node.js (version 12 or higher)
- Docker
- Cloudinary Account
- MongoDB Database

### Installation
1. Clone the repo

```sh

git clone https://github.com/0xBitBuster/redorbluepill-game.git

```

2. Enter your API Keys and Server Configuration in `docker-compose.dev.yaml` (development), `docker-compose.yaml` (production) and `next.config.js`


### Usage
To start the server in development mode, run:
```bash
docker-compose -f docker-compose.dev.yaml up --build
```
To run the server in production mode, run:
```bash
docker-compose up --build
```

* In development, the server runs on following ports: `3000` (frontend) and `4000` (backend)

* In production, the server runs on following ports: `80` (http), `81` (nginx proxy manager), `443` (https)

* In production, after you started the server, you need to configure the nginx proxy whilst redirect all frontend ("/") traffic to `http(s)://frontend:3000` and all backend ("/api/*") traffic to `http(s)://backend:4000`. 

Default Nginx Proxy Manager credentials are "admin@example.com" (Email) and "changeme" (Password)

## License

This project is licensed under the BSD-3 License - see the LICENSE file for details.
