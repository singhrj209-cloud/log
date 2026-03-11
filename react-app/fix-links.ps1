$public = @{
  'index.html' = '/'
  'about.html' = '/about'
  'services.html' = '/services'
  'road-transport.html' = '/road-transport'
  'industries.html' = '/industries'
  'blog-resources.html' = '/blog-resources'
  'pricing-plans.html' = '/pricing-plans'
  'contact.html' = '/contact'
  'faq.html' = '/faq'
  'get-quote.html' = '/get-quote'
  'shipment-tracking.html' = '/shipment-tracking'
}

$admin = @{
  'admin-login.html' = '/admin/login'
  'admin-dashboard.html' = '/admin/dashboard'
  'admin-create-shipment.html' = '/admin/create-shipment'
  'admin-shipments.html' = '/admin/shipments'
  'admin-pricing.html' = '/admin/pricing'
  'admin-bookings.html' = '/admin/bookings'
  'admin-customers.html' = '/admin/customers'
  'admin-tracking-timeline.html' = '/admin/tracking-timeline'
  'admin-update-status.html' = '/admin/update-status'
}

Get-ChildItem react-app\src\pages -Filter *.jsx | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  foreach ($k in $public.Keys) {
    $content = $content.Replace("href=`"$k`"", "href=`"$($public[$k])`"")
    $content = $content.Replace("href='$k'", "href='$($public[$k])'")
  }
  foreach ($k in $admin.Keys) {
    $content = $content.Replace("href=`"$k`"", "href=`"$($admin[$k])`"")
    $content = $content.Replace("href='$k'", "href='$($admin[$k])'")
  }
  Set-Content $_.FullName $content
}
