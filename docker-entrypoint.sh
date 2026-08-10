#!/bin/sh
set -e

# /app/media is a persistent volume (Coolify > Storages), so it starts empty on a
# fresh mount and would hide the media baked into the image. Seed it from
# /app/media-seed on every boot.
#
# `cp -rn` is no-clobber: files uploaded through the admin always win over the
# committed copy, and nothing is overwritten on redeploy. Deletions made in the
# admin will reappear on the next boot if the file is still committed to git —
# remove it from the repo too when you mean it to stay gone.
if [ -d /app/media-seed ]; then
  mkdir -p /app/media
  cp -rn /app/media-seed/. /app/media/ 2>/dev/null || true
  echo "[entrypoint] media volume seeded ($(ls -1 /app/media | wc -l) files present)"
fi

exec "$@"
