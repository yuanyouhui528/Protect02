# XML验证脚本
try {
    Write-Host "正在验证 LeadMapper.xml..."
    [xml]$leadXml = Get-Content '.\src\main\resources\mapper\lead\LeadMapper.xml' -Raw -Encoding UTF8
    Write-Host "LeadMapper.xml 验证成功" -ForegroundColor Green
} catch {
    Write-Host "LeadMapper.xml 验证失败:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

try {
    Write-Host "正在验证 UserMapper.xml..."
    [xml]$userXml = Get-Content '.\src\main\resources\mapper\user\UserMapper.xml' -Raw -Encoding UTF8
    Write-Host "UserMapper.xml 验证成功" -ForegroundColor Green
} catch {
    Write-Host "UserMapper.xml 验证失败:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

try {
    Write-Host "正在验证 pom.xml..."
    [xml]$pomXml = Get-Content '.\pom.xml' -Raw -Encoding UTF8
    Write-Host "pom.xml 验证成功" -ForegroundColor Green
} catch {
    Write-Host "pom.xml 验证失败:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "XML验证完成"