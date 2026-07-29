#!/usr/bin/env bash

set -e

YEAR=$(date +%Y)
WEEK=$(date +%V)

BASE="security/$YEAR/week-$WEEK"

if [ ! -f "$BASE/index.md" ]; then
    echo "index.md not found."
    exit 1
fi

if [ ! -f "$BASE/metadata.json" ]; then
    echo "metadata.json not found."
    exit 1
fi

TMP=$(mktemp)

jq \
    --slurpfile meta "$BASE/metadata.json" \
    '. += [{
        edition: $meta[0].edition,
        week: $meta[0].week,
        year: $meta[0].year,
        title: $meta[0].title,
        summary: $meta[0].summary,
        published: $meta[0].published,
        readingTime: $meta[0].readingTime,
        threatLevel: $meta[0].threatLevel,
        url: "/" + "'"$BASE"'" + "/index.md"
    }]' \
    security/archive.json > "$TMP"

mv "$TMP" security/archive.json

echo "[✓] Archive updated."