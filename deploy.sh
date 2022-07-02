#!/bin/bash

PROJECT_NAME="carto"
DEPLOY_REPO="dglazkov.github.io"
REPO_DIR="../${DEPLOY_REPO}"
DEST_DIR="${REPO_DIR}/${PROJECT_NAME}"

has_changes() {
  local repo_name=$(basename $(git rev-parse --show-toplevel))
  if [[ `git status --porcelain` ]]; then
    echo "Please commit changes on '${repo_name}' and run again."
    return 0
  fi
  return 1
}

if has_changes; then
  exit 1
fi

pushd ${REPO_DIR} >/dev/null

if has_changes; then
  popd
  exit 1
fi
git pull
popd

mkdir -p ${DEST_DIR}
cp *.{js,html,css} ${DEST_DIR} 2>/dev/null
cd ${DEST_DIR}

if has_changes; then
  echo "Deploying ${PROJECT_NAME} to ${DEPLOY_REPO} ..."
  git add *
  git commit -am "Deploy ${PROJECT_NAME}."
  git push
else 
  echo "No changes to deploy."
fi

echo "Fin."
