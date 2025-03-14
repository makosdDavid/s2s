<<<<<<< Updated upstream
# s2s-proto


=======
# Server-to-Server (S2S) GA4 Tracking

This project implements a server-to-server (S2S) tracking solution that captures web events via Shopify web pixels and forwards them to Google Analytics 4 (GA4).

## Features

- Collects web events from Shopify stores using web pixels
- Forwards events to Google Analytics 4 using the Measurement Protocol
- Supports custom event mapping and transformation
- Provides a simple API for testing and debugging
- TypeScript implementation for type safety and better developer experience

## Prerequisites

- Node.js 16.x or higher
- A Google Analytics 4 property with Measurement ID and API Secret
- A Shopify store with admin API access

## Installation
>>>>>>> Stashed changes

1. Clone the repository:

<<<<<<< Updated upstream
To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/idegzsaba/s2s-proto.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/idegzsaba/s2s-proto/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
=======
```bash
git clone https://github.com/yourusername/s2s.git
cd s2s
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `env/dev.env` file with the following variables:

```env
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_api_secret
GA4_STREAM_ID=your_stream_id

# The endpoint where the GA4 server is running
SERVER_ENDPOINT=https://your-domain.com/api/ga4/collect

# Shopify API credentials
SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_access_token
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET_KEY=your_api_secret_key

# Port for the GA4 endpoint server
PORT=3000
```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

This will start the server with hot reloading enabled.

### Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Activating the Web Pixel

To activate the web pixel on a Shopify store:

```bash
npm run activate-pixel your-store.myshopify.com
```

Replace `your-store.myshopify.com` with your actual Shopify store domain.

## API Endpoints

### POST /api/ga4/collect

Endpoint for collecting GA4 events.

**Request Body:**

```json
{
  "client_id": "client_id_string",
  "events": [
    {
      "name": "event_name",
      "params": {
        "param1": "value1",
        "param2": "value2"
      }
    }
  ]
}
```

### POST /api/ga4/shopify

Endpoint for processing Shopify events.

**Request Body:**

```json
{
  "name": "event_name",
  "data": {
    "key1": "value1",
    "key2": "value2"
  },
  "client_id": "client_id_string"
}
```

### GET /api/ga4/test

Endpoint for testing GA4 connection.

## Web Pixel Extension

The web pixel extension is located in the `extensions/s2s` directory. It collects events from Shopify stores and sends them to the server endpoint.

### Configuration

The web pixel extension can be configured with the following settings:

- `accountID`: Your account identifier for tracking purposes
- `enableDebug`: Set to true to enable debug console logs
- `storeEventsInLocalStorage`: Set to true to store events in browser's localStorage

## Deployment

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` directory to your server.

3. Set up environment variables on your server.

4. Start the server:

```bash
npm start
```

### GitLab CI/CD

This project can be deployed using GitLab CI/CD. Create a `.gitlab-ci.yml` file with the following configuration:

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: node:16
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  image: node:16
  script:
    - npm install
    - npm test

deploy:
  stage: deploy
  image: node:16
  script:
    - npm install
    - npm run build
    - # Add deployment steps here
  only:
    - main
```

## Future Enhancements

- IMAP email sender based on GA4 data
- Support for additional analytics platforms
- Enhanced event transformation and filtering
- User interface for configuration and monitoring

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
>>>>>>> Stashed changes
