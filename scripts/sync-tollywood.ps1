# PowerShell script to sync Tollywood movies database
try {
    Write-Host "Fetching latest Tollywood movie data..." -ForegroundColor Cyan
    $moviesJson = (Invoke-RestMethod -Uri "https://raw.githubusercontent.com/santoshimz/pattukunte-pattucheera/main/public/static/movies.json" -Headers @{"User-Agent"="GAP-Sync"})
    $constants = (Invoke-RestMethod -Uri "https://raw.githubusercontent.com/santoshimz/pattukunte-pattucheera/main/src/utils/constants.js" -Headers @{"User-Agent"="GAP-Sync"})

    $origin = [DateTimeOffset]::Parse("2022-05-22T18:30:00.000Z")
    $now = [DateTimeOffset]::UtcNow
    $currentDay = [Math]::Max(1, [Math]::Floor(($now - $origin).TotalSeconds / 86400))
    $s3Base = "https://pattukunte-pattucheera-movies.s3.amazonaws.com"
    $meta = $null
    $resolvedDay = $currentDay

    for ($d = $currentDay; $d -ge ($currentDay - 5); $d--) {
        try {
            $candidate = Invoke-RestMethod -Uri "$s3Base/$d/meta-data.json" -Headers @{"User-Agent"="GAP-Sync"} -ErrorAction Stop
            if ($candidate -and $candidate.movie) {
                $meta = $candidate
                $resolvedDay = $d
                $meta | Add-Member -NotePropertyName "day" -NotePropertyValue $d -Force
                break
            }
        } catch {}
    }

    $missing = @()
    if ($constants -match 'missingMovies\s*=\s*\[([\s\S]*?)\];') {
        $matches[1] -split "`n" | ForEach-Object {
            $m = $_.Trim().Trim('"', "'", ',')
            if ($m.Length -gt 0) { $missing += $m }
        }
    }

    $essential = @(
        "Kalki 2898 AD", "Devara: Part 1", "Pushpa: The Rise", "Pushpa 2: The Rule",
        "RRR", "Baahubali: The Beginning", "Baahubali 2: The Conclusion", "Salaar: Part 1 – Ceasefire",
        "Magadheera", "Eega", "Athadu", "Pokiri", "Okkadu", "Khaleja", "Dookudu", "Businessman",
        "Sarileru Neekevvaru", "Guntur Kaaram", "Ala Vaikunthapurramuloo", "Arya", "Arya 2",
        "Race Gurram", "Julayi", "Rangasthalam", "Dhruva", "Srimanthudu", "Bharat Ane Nenu",
        "Geetha Govindam", "Arjun Reddy", "Jersey", "Hi Nanna", "Hanu-Man", "Tillu Square",
        "DJ Tillu", "Mathu Vadalara", "Mathu Vadalara 2", "Brochevarevarura", "Agent Sai Srinivasa Athreya",
        "Goodachari", "Major", "Evaru", "Kshanam", "Hit: The First Case", "Hit: The Second Case",
        "Mirchi", "Chatrapathi", "Varsham", "Nuvvostanante Nenoddantana", "Bommarillu", "Manam",
        "Ye Maaya Chesave", "Oopiri", "C/o Kancharapalem", "Pelli Choopulu", "Samajavaragamana",
        "Balagam", "Virupaksha", "Dasara", "Mangalavaaram", "Keedaa Cola", "MAD", "Sita Ramam",
        "Mahanati", "Shyam Singha Roy", "Ante Sundaraniki", "Leader", "Happy Days"
    )

    $allMovies = @($moviesJson) + @($missing) + @($essential) | ForEach-Object { if ($_ -and $_.Trim().Length -gt 0) { $_.Trim() } } | Select-Object -Unique | Sort-Object

    New-Item -ItemType Directory -Force -Path "data" | Out-Null
    New-Item -ItemType Directory -Force -Path "data\daily" | Out-Null
    if ($meta) {
        $meta | ConvertTo-Json -Depth 5 | Set-Content -Path "data\daily\meta-data.json" -Encoding UTF8
        for ($f = 1; $f -le 5; $f++) {
            try {
                Invoke-WebRequest -Uri "$s3Base/$resolvedDay/$f.jpg" -OutFile "data\daily\$f.jpg" -Headers @{"User-Agent"="GAP-Sync"} -ErrorAction Stop
            } catch {}
        }
    }
    $output = @{
        updatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        day = $resolvedDay
        count = $allMovies.Count
        todayMeta = $meta
        movies = $allMovies
    }
    $output | ConvertTo-Json -Depth 5 | Set-Content -Path "data\tollywood-movies.json" -Encoding UTF8
    Write-Host "Successfully compiled $($allMovies.Count) Tollywood movies to data\tollywood-movies.json" -ForegroundColor Green
} catch {
    Write-Error "Sync failed: $_"
    exit 1
}
