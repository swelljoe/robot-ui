#!/bin/bash
# Build PR package

# Exit on errors
set -e

# Variable PR_NUMBER set in action
NAME="robot-ui-pr.${1}"

# Always increasing. Also a human-readable datetime.
BUILD=$(date +'%Y%m%d%H%M')

# Grab the version
VERSION=$(jq -r .version package.json)-${BUILD}

# Cleanup the old build
rm -f *.deb

echo "Building ${NAME} version ${VERSION}"

# Set package version in changelog
dch -v "${VERSION}" --distribution 'unstable' --preserve --upstream "Auto-built by GH Actions" 2>&1 > /dev/null

# Install deps, build stuff
yarn install
yarn build

# This bit is tricky/weird.
# See https://manpages.debian.org/stretch/debhelper/dh_systemd_enable.1.en.html
if [ -f "debian/robot-ui.service" ]; then
  mv "debian/robot-ui.service" "debian/${NAME}.oid_controller.service"
fi

# Change to PR name
sed -i "s/Package:.*/Package: $NAME/" debian/control

echo " * Packaging stage -------------------------------------------------"
dpkg-buildpackage -rfakeroot -uc -us
mv ../${NAME}_*deb .

echo " * Publishing stage -------------------------------------------------"
if [ -n "$APTLY_USER" ]; then
  # Generally only wanted when built in CI
  # Push the package to aptly.savioke.com, add to repo, and update published repo
  curl --user $APTLY_USER:$APTLY_PASSWD -X POST -F file=@${NAME}_${VERSION}_all.deb https://aptly.savioke.com/api/files/${NAME}_${VERSION}
  curl --user $APTLY_USER:$APTLY_PASSWD -X POST https://aptly.savioke.com/api/repos/savioke-focal/file/${NAME}_${VERSION}
  curl --user $APTLY_USER:$APTLY_PASSWD https://aptly.savioke.com/publish/s3:aptly.savioke.com:savioke-focal/focal
else
  # Cleanup (only needed for local builds)
  # Change name throughout debian dir
  rm -f "debian/${NAME}.robot-ui.service"
  git checkout debian/robot-ui.service
  git checkout debian/control
  git checkout debian/changelog
  rm -rf debian/.debhelper
  rm -rf debian/${NAME}/
  rm -f debian/files
fi
