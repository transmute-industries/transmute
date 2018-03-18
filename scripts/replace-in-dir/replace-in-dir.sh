
echo 'Replace in Directory  ' $1
echo 'Changing  ' $2
echo 'To        ' $3

find $1 -type f | xargs sed -i '' 's/'$2'/'$3'/g'

# ./scripts/replace-in-dir/replace-in-dir.sh  ./scripts/replace-in-dir/file.json 32443 12343