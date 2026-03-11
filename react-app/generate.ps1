$pages = @(
  @{ file='index.html'; name='Home'; imports='initScrollAnimations, initWhyAnimations, initTestimonialsTrack, initSidebar' },
  @{ file='about.html'; name='About'; imports='initScrollAnimations, initTestimonialsTrack, initSidebar' },
  @{ file='services.html'; name='Services'; imports='initScrollAnimations, initTestimonialsTrack, initSidebar' },
  @{ file='road-transport.html'; name='RoadTransport'; imports='initScrollAnimations, initTestimonialsTrack, initSidebar' },
  @{ file='industries.html'; name='Industries'; imports='initScrollAnimations, initTestimonialsTrack, initSidebar' },
  @{ file='blog-resources.html'; name='BlogResources'; imports='initScrollAnimations, initSidebar' },
  @{ file='pricing-plans.html'; name='PricingPlans'; imports='initScrollAnimations, initSidebar' },
  @{ file='contact.html'; name='Contact'; imports='initScrollAnimations, initSidebar' },
  @{ file='faq.html'; name='Faq'; imports='initScrollAnimations, initSidebar, initFaq' },
  @{ file='get-quote.html'; name='GetQuote'; imports='initScrollAnimations, initTestimonialsTrack, initSidebar, initGetQuote' },
  @{ file='shipment-tracking.html'; name='ShipmentTracking'; imports='initScrollAnimations, initTestimonialsTrack, initSidebar, initShipmentTracking' },
  @{ file='admin-login.html'; name='AdminLogin'; imports='initLogin'; admin=$true },
  @{ file='admin-dashboard.html'; name='AdminDashboard'; imports='initAdminCommon, initDashboard'; admin=$true },
  @{ file='admin-create-shipment.html'; name='AdminCreateShipment'; imports='initAdminCommon, initCreateShipment'; admin=$true },
  @{ file='admin-shipments.html'; name='AdminShipments'; imports='initAdminCommon, initShipmentList'; admin=$true },
  @{ file='admin-pricing.html'; name='AdminPricing'; imports='initAdminCommon, initPricing'; admin=$true },
  @{ file='admin-bookings.html'; name='AdminBookings'; imports='initAdminCommon, initBookings'; admin=$true },
  @{ file='admin-customers.html'; name='AdminCustomers'; imports='initAdminCommon, initCustomers'; admin=$true },
  @{ file='admin-tracking-timeline.html'; name='AdminTrackingTimeline'; imports='initAdminCommon, initTimeline'; admin=$true },
  @{ file='admin-update-status.html'; name='AdminUpdateStatus'; imports='initAdminCommon, initUpdateStatus'; admin=$true }
)

function Escape-TemplateLiteral([string]$text) {
  $text = $text -replace '`', '\`'
  $text = $text -replace '\$\{', '\\${'
  return $text
}

foreach ($p in $pages) {
  $raw = Get-Content $p.file -Raw
  $styleMatch = [regex]::Match($raw, '(?s)<style>(.*?)</style>')
  $style = if ($styleMatch.Success) { $styleMatch.Groups[1].Value.Trim() } else { '' }
  $bodyMatch = [regex]::Match($raw, '(?s)<body[^>]*>(.*?)</body>')
  if (-not $bodyMatch.Success) { throw "No body in $($p.file)" }
  $body = $bodyMatch.Groups[1].Value
  $body = [regex]::Replace($body, '(?s)<script.*?>.*?</script>', '')
  $style = Escape-TemplateLiteral($style)
  $body = Escape-TemplateLiteral($body.Trim())
  $imports = $p.imports
  $importLine = if ($p.admin) { "import { $imports } from '../utils/adminPanel';" } else { "import { $imports } from '../utils/publicUi';" }
  $initCalls = ($imports -split ',\s*') | ForEach-Object { "cleanups.push($($_)());" }
  $initBlock = ($initCalls -join "`r`n    ")
  $useEffectBody = @"
    const cleanups = [];
    $initBlock
    return () => { cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); }); };
"@
  $component = @"
import { useEffect } from 'react';
$importLine

const styles = ``
$style
``;

const markup = ``
$body
``;

export default function $($p.name)() {
  useEffect(() => {
$useEffectBody
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}
"@
  $outPath = "react-app/src/pages/$($p.name).jsx"
  Set-Content $outPath $component
}
