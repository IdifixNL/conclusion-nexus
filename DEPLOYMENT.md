# Deployment Setup

This project uses GitHub Actions for automatic deployment to your server.

## GitHub Secrets Required

You need to add these secrets to your GitHub repository:

1. Go to your repository: `https://github.com/IdifixNL/conclusion-nexus`
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

### Required Secrets:

- `HOST`: Your server IP address (e.g., `192.168.1.100`)
- `USERNAME`: SSH username (e.g., `webadmin`)
- `SSH_KEY`: Your private SSH key (the entire private key content)
- `PORT`: SSH port (usually `22`)

## SSH Key Setup

1. Generate SSH key pair (if you don't have one):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions"
   ```

2. Add the public key to your server:
   ```bash
   # On your server
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. Add the private key to GitHub secrets as `SSH_KEY`

## Workflow Behavior

The workflow will:
1. Trigger on every push to `main` branch
2. SSH to your server
3. Navigate to `~/apps/conclusion-nexus`
4. Pull latest code from GitHub
5. Restart the application:
   - If `docker-compose.yml` exists: `docker-compose down && docker-compose up -d --build`
   - Otherwise: `npm install && pm2 restart conclusion-nexus`

## Testing the Workflow

1. Push any change to the `main` branch
2. Check the Actions tab in GitHub to see the deployment progress
3. Verify your application is updated on the server 