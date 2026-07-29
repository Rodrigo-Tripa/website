#!/usr/bin/env bash

set -e

TMP=$(mktemp)

echo "[" > "$TMP"

FIRST=true

find security -name metadata.json | sort | while read META
do

    DIR=$(dirname "$META")

    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$TMP"
    fi

    jq \
        --arg url "/$DIR/index.md" \
        '. + {url:$url}' \
        "$META" >> "$TMP"

done

echo "]" >> "$TMP"

mv "$TMP" security/archive.json

echo "[✓] archive.json rebuilt."