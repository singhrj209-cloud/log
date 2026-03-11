import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import RoadTransport from './pages/RoadTransport';
import Industries from './pages/Industries';
import BlogResources from './pages/BlogResources';
import PricingPlans from './pages/PricingPlans';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import GetQuote from './pages/GetQuote';
import ShipmentTracking from './pages/ShipmentTracking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateShipment from './pages/AdminCreateShipment';
import AdminShipments from './pages/AdminShipments';
import AdminPricing from './pages/AdminPricing';
import AdminBookings from './pages/AdminBookings';
import AdminCustomers from './pages/AdminCustomers';
import AdminTrackingTimeline from './pages/AdminTrackingTimeline';
import AdminUpdateStatus from './pages/AdminUpdateStatus';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/index.html' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/about.html' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/services.html' element={<Services />} />
        <Route path='/road-transport' element={<RoadTransport />} />
        <Route path='/road-transport.html' element={<RoadTransport />} />
        <Route path='/industries' element={<Industries />} />
        <Route path='/industries.html' element={<Industries />} />
        <Route path='/blog-resources' element={<BlogResources />} />
        <Route path='/blog-resources.html' element={<BlogResources />} />
        <Route path='/pricing-plans' element={<PricingPlans />} />
        <Route path='/pricing-plans.html' element={<PricingPlans />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/contact.html' element={<Contact />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/faq.html' element={<Faq />} />
        <Route path='/get-quote' element={<GetQuote />} />
        <Route path='/get-quote.html' element={<GetQuote />} />
        <Route path='/shipment-tracking' element={<ShipmentTracking />} />
        <Route path='/shipment-tracking.html' element={<ShipmentTracking />} />

        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin-login.html' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin-dashboard.html' element={<AdminDashboard />} />
        <Route path='/admin/create-shipment' element={<AdminCreateShipment />} />
        <Route path='/admin-create-shipment.html' element={<AdminCreateShipment />} />
        <Route path='/admin/shipments' element={<AdminShipments />} />
        <Route path='/admin-shipments.html' element={<AdminShipments />} />
        <Route path='/admin/pricing' element={<AdminPricing />} />
        <Route path='/admin-pricing.html' element={<AdminPricing />} />
        <Route path='/admin/bookings' element={<AdminBookings />} />
        <Route path='/admin-bookings.html' element={<AdminBookings />} />
        <Route path='/admin/customers' element={<AdminCustomers />} />
        <Route path='/admin-customers.html' element={<AdminCustomers />} />
        <Route path='/admin/tracking-timeline' element={<AdminTrackingTimeline />} />
        <Route path='/admin-tracking-timeline.html' element={<AdminTrackingTimeline />} />
        <Route path='/admin/update-status' element={<AdminUpdateStatus />} />
        <Route path='/admin-update-status.html' element={<AdminUpdateStatus />} />

        <Route path='*' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
