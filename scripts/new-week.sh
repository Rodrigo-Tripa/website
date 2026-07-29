#!/usr/bin/env bash

set -e

YEAR=$(date +%Y)
WEEK=$(date +%V)

TEMPLATE="security/templates/weekly-template.md"
BASE="security/$YEAR/week-$WEEK"

echo "[*] Creating Security Weekly Week $WEEK ($YEAR)..."

mkdir -p "$BASE/images"

if [ ! -f "$BASE/index.md" ]; then
    cp "$TEMPLATE" "$BASE/index.md"
fi

if [ ! -f "$BASE/metadata.json" ]; then

cat > "$BASE/metadata.json" <<EOF
{
    "edition": 1,
    "week": $WEEK,
    "year": $YEAR,
    "title": "Security Weekly #001",
    "summary": "",
    "published": "$(date +%F)",
    "readingTime": 0,
    "threatLevel": "Moderate"
}
EOF

fi

echo "[✓] Created:"
echo "    $BASE"