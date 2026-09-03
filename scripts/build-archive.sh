#!/usr/bin/env bash

set -euo pipefail

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

echo "[" > "$TMP"

FIRST=true

while IFS= read -r META
do
    DIR=$(dirname "$META")
    EDITION_PATH="${DIR#security/}"
    URL="/security/${EDITION_PATH}/"

    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$TMP"
    fi

    jq --arg url "$URL" '. + {url:$url}' "$META" >> "$TMP"
done < <(find security -name metadata.json -print | sort)

echo "]" >> "$TMP"

mv "$TMP" security/archive.json

echo "[✓] security/archive.json rebuilt with canonical report URLs."
