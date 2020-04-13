#!/usr/bin/env bash

set -euf -o pipefail

# can not use config.sh in this file, will be fixed once this file gets generated.
export TZ="Europe/Vienna"
export USERNAME="grundstein"
export USERHOME="/home/grundstein"
export NODE_VERSION=13
export NVM_DIR="$USERHOME/.nvm"
export GIT_URL="git://github.com/grundstein"

ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

printf "${YELLOW}GRUNDSTEIN${NC} starting bootstrap\n"

# update apt sources
apt -y update

# install git
apt -y install git software-properties-common makepasswd curl nano python3-pip

# prepare certbot install
add-apt-repository -y universe
add-apt-repository -y ppa:certbot/certbot
apt -y update

# update packages
apt -y upgrade

# cleanup unneeded packages
apt -y autoremove

printf "${GREEN}GRUNDSTEIN${NC} apt installation done.\n"

printf "${YELLOW}GRUNDSTEIN${NC} starting user generation\n"
# remove user if it exists

id -u "$USERNAME" &>/dev/null && userdel grundstein

# add user. one should be fine for now. we do not need to know the password
PASSWORD=$(makepasswd --min 42 --max 42)
useradd -m -p "$PASSWORD" -d "$USERHOME" -s /bin/bash "$USERNAME"

printf "${GREEN}GRUNDSTEIN${NC} user generated successfully.\n"

printf "${GREEN}GRUNDSTEIN${NC} bootstrap done\n"

printf "${YELLOW}GRUNDSTEIN${NC} starting git clone of grundsteinlegung."

git clone git://github.com/grundstein/legung /grundsteinlegung

su - "$USERNAME" -c "/usr/bin/env bash /grundsteinlegung/bash/bootstrap-certbot.sh"

# su - "$USERNAME" -c "/usr/bin/env bash /grundsteinlegung/bash/bootstrap-user-env.sh"
