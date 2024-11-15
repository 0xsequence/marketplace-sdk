#!/bin/bash

echo "Setting up symlinked exports, for local development..."
package_file="./package.json"

# Clear dist directory
dist_dir="./dist"
rm -rf "$dist_dir"
mkdir -p "$dist_dir"

# loop through all exports and create symlinks from src to dist
while read -r export_path; do
  src_path="${export_path/\.\/dist/src}"
  src_path="${src_path%.js}.ts"

  dist_path="${export_path/\.\//}"
  dist_path_type="${dist_path%.js}.d.ts"
  dist_dir=$(dirname "$dist_path")

  mkdir -p "$dist_dir"
  ln -sf "$src_path" "$dist_path"
  ln -sf "$src_path" "$dist_path_type"

  echo " $src_path"
  echo "  ↪ $dist_path_type"
  echo "  ↪ $dist_path"
done < <(jq -r '.exports[] | objects | .default' "$package_file")

echo "Done, all symlinks are set up! 🎉"
