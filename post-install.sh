#!/bin/bash

echo "Setting up symlinked exports..."

# Find all package.json files, excluding dist and node_modules
package_files=$(find $(pwd -P) -name "package.json" -not -path "*/dist/*" -not -path "*/node_modules/*")

for package_file in $package_files; do
  package_dir=$(dirname "$package_file")
  package_name=$(jq -r '.name // ""' "$package_file")

  # Skip if no exports field
  if ! jq -e 'has("exports")' "$package_file" >/dev/null; then
    continue
  fi

  echo "$package_name"

  # Clear dist directory
  dist_dir="$package_dir/dist"
  rm -rf "$dist_dir"
  mkdir -p "$dist_dir"

  # loop through all exports and create symlinks from src to dist
  while read -r export_path; do
    src_path="${package_dir}/${export_path/\.\/dist/src}"
    src_path="${src_path%.js}.ts"

    dist_path="$package_dir/${export_path/\.\//}"
    dist_path_type="${dist_path%.js}.d.ts"
    dist_dir=$(dirname "$dist_path")

    mkdir -p "$dist_dir"

    if [[ $export_path == *.js ]]; then
      ln -sf "$src_path" "$dist_path"
      ln -sf "$src_path" "$dist_path_type"
      echo " Creating symlinks:"
      echo " $src_path"
      echo "  ↪ $dist_path_type"
      echo "  ↪ $dist_path"
    else
      touch "$dist_path"
      touch "$dist_path_type"
      echo " Creating empty files:"
      echo "  → $dist_path"
      echo "  → $dist_path_type"
    fi
  done < <(jq -r '.exports[] | objects | .default' "$package_file")
done

echo "Done, all symlinks are set up! 🎉"
