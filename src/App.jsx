import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Layout from './layout'
import Home from './page'
import About from './about/page'
import Contact from './contact/page'
import Properties from './properties/page'
import PropertyDetails from './property/[id]/page'
import Blog from './blog/page'
import BlogPost from './blog/[id]/page'
import FAQ from './faq/page'
import Gallery from './gallery/page'
import Testimonials from './testimonials/page'
import WhyChooseUs from './why-choose-us/page'
import AdminDashboard from './admindashboard/page'
import AdminLogin from './admindashboard/admin/login/page'
import AdminDashboardPage from './admindashboard/admin/dashboard/page'
import AdminProperties from './admindashboard/admin/properties/page'
import AdminInquiries from './admindashboard/admin/inquiries/page'
import AdminContacts from './admindashboard/admin/contacts/page'
import AdminTestimonials from './admindashboard/admin/testimonials/page'
import AdminGallery from './admindashboard/admin/gallery/page'
import AdminProfile from './admindashboard/admin/profile/page'
// import AdminChangePassword from './admindashboard/admin/change-password/page'
import AdminSocialMedia from './admindashboard/admin/social-media/page'
import AdminBlog from './admindashboard/admin/blog/page'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/properties" element={<Layout><Properties /></Layout>} />
        <Route path="/property/:id" element={<Layout><PropertyDetails /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/blog/:id" element={<Layout><BlogPost /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/testimonials" element={<Layout><Testimonials /></Layout>} />
        <Route path="/why-choose-us" element={<Layout><WhyChooseUs /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/properties" element={<AdminProperties />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
        <Route path="/admin/testimonials" element={<AdminTestimonials />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/social-media" element={<AdminSocialMedia />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        {/* <Route path="/admin/change-password" element={<AdminChangePassword />} /> */}
      </Routes>
    </Router>
  )
}

export default App
