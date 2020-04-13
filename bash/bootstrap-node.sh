#!/usr/bin/env bash

set -euf -o pipefail

source /grundsteinlegung/bash/config.sh

printf "${YELLOW}GRUNDSTEIN${NC} starting user env generation.\n"

echo "whoami? $(whoami)"

printf "${YELLOW}GRUNDSTEIN${NC} installing nvm in ${NVM_DIR}.\n"

bash /grundsteinlegung/bash/nvm-install.sh

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

printf "${YELLOW}GRUNDSTEIN${NC} install node ${NVM_NODE_VERSION} and use it as default"

nvm install $NVM_NODE_VERSION
nvm use $NVM_NODE_VERSION

node --version

printf "${GREEN}GRUNDSTEIN${NC} nodejs ${NVM_NODE_VERSION} installed.\n"