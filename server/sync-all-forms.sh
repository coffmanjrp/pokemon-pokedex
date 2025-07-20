#!/bin/bash

# Sync all Pokemon forms to pokemon table
echo "Starting sync of all Pokemon forms..."
echo "This will sync all forms (108 total) to the pokemon table."
echo ""

# Mega Evolutions (30 forms)
echo "Syncing Mega Evolutions..."
for id in {10033..10062}; do
  echo "Syncing form $id..."
  npm run sync:pokemon $id
  sleep 0.5  # Small delay to avoid rate limiting
done

# Alolan Forms (18 forms)
echo ""
echo "Syncing Alolan Forms..."
for id in 10091 10092 10093 10094 10095 10096 10097 10098 10099 10100 10101 10102 10103 10104 10105 10106 10107 10108; do
  echo "Syncing form $id..."
  npm run sync:pokemon $id
  sleep 0.5
done

# Galarian Forms (19 forms)
echo ""
echo "Syncing Galarian Forms..."
for id in {10158..10176}; do
  echo "Syncing form $id..."
  npm run sync:pokemon $id
  sleep 0.5
done

# Hisuian Forms (16 forms)
echo ""
echo "Syncing Hisuian Forms..."
for id in {10229..10244}; do
  echo "Syncing form $id..."
  npm run sync:pokemon $id
  sleep 0.5
done

# Paldean Forms (5 forms)
echo ""
echo "Syncing Paldean Forms..."
for id in {10250..10254}; do
  echo "Syncing form $id..."
  npm run sync:pokemon $id
  sleep 0.5
done

# Other special forms
echo ""
echo "Syncing other special forms..."
for id in 10119 10120 10177 10178 10179 10180 10181 10182 10184 10185 10186 10187 10193 10194 10195 10228 10245 10246 10247 10248 10249; do
  echo "Syncing form $id..."
  npm run sync:pokemon $id
  sleep 0.5
done

echo ""
echo "All forms sync completed!"