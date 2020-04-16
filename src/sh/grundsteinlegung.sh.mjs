export default ({ env, bashConfig, writeBashConfig }) =>
  `
#!/usr/bin/env bash

set -euf -o pipefail

printf "GRUNDSTEIN writing config file\\n"

${bashConfig}

${writeBashConfig}

printf "GRUNDSTEIN wrote /grundstein-config.sh file successfully\\n"

printf "GRUNDSTEIN source config file to get it\'s content and make sure it works\\n"

source /grundstein-config.sh

ln -snf /usr/share/zoneinfo/${env.TZ} /etc/localtime && echo ${env.TZ} > /etc/timezone

printf "\${YELLOW}GRUNDSTEIN\${NC} starting bootstrap\\n"

# update apt sources
apt -y update

# install dependencies

# curl needed for nvm
# makepasswd needed for user generation below
# nano should later be removed from the list, convenience install for dev.
apt -y install git makepasswd curl nano python software-properties-common python3-pip

# update packages
apt -y upgrade

# cleanup unneeded packages
apt -y autoremove

printf "\${GREEN}GRUNDSTEIN\${NC} apt installation done.\\n"


printf "\${YELLOW}GRUNDSTEIN\${NC} starting git clone of grundsteinlegung.\\n"

git clone "$GIT_URL/legung" /grundsteinlegung

printf "\${GREEN}GRUNDSTEIN\${NC} grundsteinlegung cloned. starting service setup\\n"

# generate grundstein user
/usr/bin/env bash /grundsteinlegung/bash/create-user.sh

# install and setup certbot
# /usr/bin/env bash /grundsteinlegung/bash/certbot.sh

/usr/bin/env bash /grundsteinlegung/bash/node.sh

/usr/bin/env bash /grundsteinlegung/bash/services.sh
`.trimStart()
