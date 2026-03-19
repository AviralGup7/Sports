Get-ChildItem -Recurse -File | ForEach-Object {
  $lines = (Get-Content -ErrorAction SilentlyContinue -Path $_.FullName | Measure-Object -Line).Lines
  [PSCustomObject]@{Path=$_.FullName;Lines=$lines}
} | Sort-Object -Property Lines -Descending | ConvertTo-Csv -NoTypeInformation
