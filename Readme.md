# Apropapp Backend

In this repository you will find the source code for the Apropapp backend.

More details for the frontend implementation can be found at [Apropapp Frontend](https://github.com/pcs289/hackovid-back)

## Installation

Use the package manager [npm](https://npm.js) to install the dependencies.

```bash
npm install
```

## Environment Variables

In order for this software to work, you will need to create a ```.env``` file on the root of the repository containing the following environment variables with your own values. (*NOTE: dummy values*)

```yaml
FRONTEND_URL=YourFrontendURL
SECRET=YourSecret
MONGO_URL=YourUrlToMongoDB

```

## Usage

Once dependencies are installed, the environment variables set, we can now start the server.

```bash
npm run start
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This software is licensed under [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/). 
