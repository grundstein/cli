set -euf -o pipefail

export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export NC='\033[0m' # No Color

printf "\${YELLOW}GRUNDSTEIN\${NC} starting user generation\\n"

# add user if it does not exist.
# one should be fine for now.
# we do not need to know the password.
id -u "$USERNAME" &>/dev/null || (
  PASSWORD=$(makepasswd --min 42 --max 42)
  useradd -m -p "$PASSWORD" -d "$USERHOME" -s /bin/bash "$USERNAME"
)

printf "\${GREEN}GRUNDSTEIN\${NC} user generated successfully.\\n"
