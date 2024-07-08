# Front

(file)

1. [Trello Front](https://trello.com/invite/b/VV5c6znJ/ATTI791d6c78e353dfba56a89b25abf45379A1532A43/beep-front)
2. [Trello composant](https://trello.com/invite/b/eDPWKHlE/ATTI5d798f2d27160f95ff948e5059cc99f569849308/beep-composants)
3. [Documentation Notion](https://www.notion.so/Beep-4f3dd311e08a4de38fc1c901bef44322)

Forget `npm` we will use `pnpm`. Install:

```bash
sudo npm install -g pnpm
```

Install packages:

```sh
pnpm install
```

Launch frontend:

```sh
pnpm run start
```

## Configuration

Make sure that you provided a `.env` file with the following content:

```env
VITE_BACKEND_URL=
VITE_WEBRTC_URL=
```

For example (suitable for local development):

```env
VITE_BACKEND_URL=http://localhost:3333/
VITE_WEBRTC_URL=http://127.0.0.1:8080
```

## Docker

Build locally for debug:

```sh
pnpm run build:docker
```

(Can be really long)

Run the built image:

```sh
pnpm run start:docker
```

## Quality

Testing:

```bash
pnpm run lint
```

Linting:

```bash
pnpm run test
```
