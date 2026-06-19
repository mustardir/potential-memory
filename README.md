# potential-memory

This repository uses Git LFS for large files. The devcontainer automatically
installs and initializes Git LFS on container creation.

If you see an error about missing `git-lfs` when pushing, rebuild the devcontainer
or run the following locally to install Git LFS:

Linux (Debian/Ubuntu):

```sh
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install -y git-lfs
git lfs install
```

Alpine Linux:

```sh
sudo apk add --no-cache git-lfs
git lfs install
```
