#!/bin/sh
set -e

if command -v git-lfs >/dev/null 2>&1; then
  echo "git-lfs already installed"
  exit 0
fi

if [ -f /etc/os-release ]; then
  . /etc/os-release
fi

case "${ID:-}" in
  alpine)
    apk add --no-cache git-lfs || exit 0
    ;;
  ubuntu|debian)
    if command -v apt-get >/dev/null 2>&1; then
      apt-get update
      apt-get install -y git-lfs || {
        curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
        apt-get install -y git-lfs || true
      }
    fi
    ;;
  fedora|centos|rhel)
    if command -v dnf >/dev/null 2>&1; then
      dnf install -y git-lfs || true
    else
      yum install -y git-lfs || true
    fi
    ;;
  *)
    echo "Could not detect supported distro; please install git-lfs manually."
    ;;
esac

if command -v git-lfs >/dev/null 2>&1; then
  git lfs install || true
  echo "git-lfs installed and initialized"
fi

exit 0
