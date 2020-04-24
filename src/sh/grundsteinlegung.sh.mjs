import path from 'path'

import { log } from '@grundstein/commons'

import { colors, writeFile } from '../lib/index.mjs'

export default async config => {
  log('Creating grundsteinlegung.sh', config)

  const { dir, env } = config

  const { GREEN, RED, YELLOW, NC } = colors

  const { INSTALL_LOG } = env

  const logDir = path.dirname(INSTALL_LOG);

  const contents = `
#!/usr/bin/env bash

set -euf -o pipefail

export DEBIAN_FRONTEND=noninteractive



printf "${YELLOW}log dir${NC} - mkdir ${logDir}\\n\\n"

mkdir -p ${logDir}

printf "${logDir} ${GREEN}created${NC}\\n\\n"



printf "${YELLOW}apt update${NC}\\n"

apt-get -y update > ${INSTALL_LOG}

printf "apt update: ${GREEN}done${NC}\\n\\n"



printf "${YELLOW}timezones${NC} - setup\\n"

ln -fs /usr/share/zoneinfo/${env.TZ} /etc/localtime

apt-get install -y tzdata > ${INSTALL_LOG}

dpkg-reconfigure -f noninteractive tzdata > ${INSTALL_LOG}

printf "timezones: ${GREEN}done${NC}\\n\\n"



printf "${YELLOW}install${NC} dependencies\\n"

# curl needed for nvm
# makepasswd needed for user generation below
# nano should later be removed from the list, convenience install for dev.

apt-get -qq -y install \
git \
makepasswd \
curl \
software-properties-common \
ntp \
nano \
> ${INSTALL_LOG}

printf "install dependencies: ${GREEN}done${NC}\\n\\n"



printf "${YELLOW}apt upgrade${NC}\\n"

apt-get -qq -y upgrade > ${INSTALL_LOG}

printf "apt upgrade: ${GREEN}done${NC}\\n\\n"



printf "${YELLOW}apt autoremove${NC}\\n"

apt-get -y autoremove > ${INSTALL_LOG}

printf "apt autoremove ${GREEN}done${NC}\\n\\n"



printf "${YELLOW}git clone${NC} grundsteinlegung.\\n"

git clone  "${env.GIT_URL}/cli" /grundsteinlegung > ${INSTALL_LOG}

printf "grundsteinlegung ${GREEN}cloned${NC}\\n\\n"



printf "${YELLOW}user generation${NC}\\n"

# add user if it does not exist.
# one should be fine for now.
# we do not need to know the password.
id -u "${env.USERNAME}" &>/dev/null || (
  PASSWORD=$(makepasswd --min 42 --max 42)
  useradd -m -p "$PASSWORD" -d "${env.USERHOME}" -s /bin/bash "${env.USERNAME}"
)

printf "user generation: ${GREEN}done${NC}\\n\\n"



printf "${YELLOW}certbot${NC} - install\\n"

add-apt-repository -y universe > ${INSTALL_LOG}
add-apt-repository -y ppa:certbot/certbot > ${INSTALL_LOG}
apt-get -y update > ${INSTALL_LOG}

# actually install certbot
TZ=${env.TZ} apt-get -y install \
python \
python3-pip \
certbot \
> ${INSTALL_LOG}

# install certbot digitalocean plugin.
pip3 install certbot-dns-digitalocean > ${INSTALL_LOG}

printf "certbot install: ${GREEN}done${NC}\\n\\n"



printf "${YELLOW}install${NC} nodejs\\n"
# install nodejs
/usr/bin/env bash /grundsteinlegung/bash/node.sh > ${INSTALL_LOG}

printf "nodejs install ${GREEN}done${NC}\\n\\n"

`.trimStart()

  await writeFile({ name: 'grundsteinlegung', config, contents, dir })

  return contents
}
