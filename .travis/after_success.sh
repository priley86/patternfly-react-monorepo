#!/usr/bin/env bash
set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not releasing"
  exit 0
fi

if [ "${TRAVIS_REPO_SLUG}" == "${TRIGGER_REPO_SLUG}" -a "$TRAVIS_BRANCH" == "${TRIGGER_REPO_BRANCH}" ]; then
  yarn travis-deploy-once "yarn semantic-release"
fi