$extensions = @('.ts','.tsx','.js','.jsx','.mjs','.cjs','.json','.css','.scss','.sass','.md','.html','.sql')

Get-ChildItem -Recurse -File | Where-Object {
  $p = $_.FullName
  $p -notmatch '\\node_modules\\' -and $p -notmatch '\\.next\\' -and $p -notmatch '\\.git\\'
} | Where-Object {
  $extensions -contains ($_.Extension.ToLower())
} | ForEach-Object {
  $lines = (Get-Content -ErrorAction SilentlyContinue -Path $_.FullName | Measure-Object -Line).Lines
  "{0}`t{1}" -f $lines, $_.FullName
} | Sort-Object {[int]($_ -split "`t")[0]} -Descending
