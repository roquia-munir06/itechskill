
import React from "react";
import AdminInquiriesPage from './pages/AdminInquiriesPage';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Pages
import YouTubeRecommendations from "./pages/YouTubeRecommendations";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboards
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

// Admin Pages
import Users from "./pages/Users";
import Students from "./pages/Students";
import Lectures from "./pages/Lectures";
import MockExams from "./pages/MockExam";
import ExamQuestionsPage from "./pages/ExamQuestionsPage";
import AdminExamResults from "./pages/AdminExamResults";
import AdminMessages from "./pages/AdminMessages";
import StudentMessages from "./pages/StudentMessages";

// Student Pages
import StudentCoursesPage from "./pages/StudentCoursesPage";
import StudentLecturesPage from "./pages/StudentLecturesPage";
import StudentExamsPage from "./pages/StudentExamsPage";
import StudentExamAttemptPage from "./pages/StudentExamAttemptPage";

// Protected Route
import ProtectedRoute from "./routes/ProtectedRoute";
import PricingPlan from "./pages/PricingPlan";
import Courses_Screen from "./pages/Courses_Screen";
import WithNavbar from "./layouts/WithNavbar";

import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import All_Courses from "./pages/All_Courses";
import Certification from "./pages/Certification";
import AffiliateProgram from "./pages/AffiliateProgram";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import HelpCenter from "./pages/HelpCenter";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import CategoryPage from "./pages/CategoryPage";
import OpenPositions from "./components/OpenPositions";
import AdminBlogs from "./pages/AdminBlogs";
import BlogDetails from './pages/BlogDetails';
import DiplomaScreen from "./pages/DiplomasScreen";
// import SearchResults from './components/SearchResults';
import AdminDiplomas from "./pages/AdminDiplomas";
import DiplomaDetail from "./pages/DiplomaDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AddCoursePage from "./pages/AddCoursePage";
import CourseDetail_Screen from './pages/CourseDetail_Screen';
import Courses from './pages/Courses';
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminCertificationsPage from './pages/AdminCertificationsPage';
import AdminJobsPage from "./pages/Adminjobspage";
import FeeStructure from "./pages/FeeStructure";

const GOOGLE_CLIENT_ID = "6986784869-oqb208j0kv2ur695evmnu33ovc4r9lcb.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>

              {/* ─── Public Routes with Navbar ─── */}
              <Route element={<WithNavbar />}>
                <Route path="/" element={<YouTubeRecommendations />} />
                <Route path="/pricing" element={<PricingPlan />} />
                <Route path="/trainings" element={<Courses_Screen />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/AboutUs" element={<AboutUs />} />
                <Route path="/Careers" element={<Careers />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/Categories" element={<Categories />} />
                <Route path="/course" element={<All_Courses />} />
                <Route path="/Certification" element={<Certification />} />
                <Route path="/Affiliateprogram" element={<AffiliateProgram />} />
                <Route path="/Privacy" element={<Privacy />} />
                <Route path="/Terms" element={<Terms />} />
                <Route path="/HelpCenter" element={<HelpCenter />} />
                <Route path="/Faq" element={<Faq />} />
                <Route path="/Blog" element={<Blog />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/open-positions" element={<OpenPositions />} />
                <Route path="/feestructure" element={<FeeStructure />} />
                <Route path="/blog/:slug" element={<BlogDetails />} />
                {/* <Route path="/search" element={<SearchResults />} /> */}
                <Route path="/diplomas" element={<DiplomaScreen />} />
                <Route path="/diplomas/:slug" element={<DiplomaDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/course/:slug" element={<CourseDetail_Screen />} />
              </Route>

              {/* ─── Admin Routes ─── */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute role="Admin"><Dashboard /></ProtectedRoute>
              }/>
              <Route path="/users" element={
                <ProtectedRoute role="Admin"><Users /></ProtectedRoute>
              }/>
              <Route path="/students" element={
                <ProtectedRoute role="Admin"><Students /></ProtectedRoute>
              }/>
              <Route path="/admin/diplomas" element={
                <ProtectedRoute role="Admin"><AdminDiplomas /></ProtectedRoute>
              }/>
              <Route path="/admin/exam-results" element={
                <ProtectedRoute role="Admin"><AdminExamResults /></ProtectedRoute>
              }/>
              <Route path="/admin/blogs" element={
                <ProtectedRoute role="Admin"><AdminBlogs /></ProtectedRoute>
              }/>
              <Route path="/admin/programs" element={
                <ProtectedRoute role="Admin"><AddCoursePage /></ProtectedRoute>
              }/>
              <Route path="/admin/orders" element={
                <ProtectedRoute role="Admin"><AdminOrdersPage /></ProtectedRoute>
              }/>
              <Route path="/admin/inquiries" element={
                <ProtectedRoute role="Admin"><AdminInquiriesPage /></ProtectedRoute>
              }/>
              <Route path="/admin/certifications" element={
                <ProtectedRoute role="Admin"><AdminCertificationsPage /></ProtectedRoute>
              }/>
              <Route path="/admin/jobs" element={
                <ProtectedRoute role="Admin"><AdminJobsPage /></ProtectedRoute>
              }/>

              {/* ─── Shared: Admin + Teacher ─── */}
              <Route path="/courses" element={
                <ProtectedRoute roles={["Admin", "Teacher"]}>
                  <Courses />
                </ProtectedRoute>
              }/>
              <Route path="/lectures/:courseId" element={
                <ProtectedRoute roles={["Admin", "Teacher"]}>
                  <Lectures />
                </ProtectedRoute>
              }/>
              <Route path="/mockexams" element={
                <ProtectedRoute roles={["Admin", "Teacher"]}>
                  <MockExams />
                </ProtectedRoute>
              }/>
              <Route path="/mock-exams/:examId/questions" element={
                <ProtectedRoute roles={["Admin", "Teacher"]}>
                  <ExamQuestionsPage />
                </ProtectedRoute>
              }/>

              {/* ─── Shared: Admin + Teacher + Manager ─── */}
              <Route path="/admin/messages" element={
                <ProtectedRoute roles={["Admin", "Teacher", "Manager"]}>
                  <AdminMessages />
                </ProtectedRoute>
              }/>

              {/* ─── Teacher Routes ─── */}
              <Route path="/teacher/dashboard" element={
                <ProtectedRoute role="Teacher"><TeacherDashboard /></ProtectedRoute>
              }/>
              <Route path="/teacher/mockexams" element={
                <ProtectedRoute role="Teacher"><MockExams /></ProtectedRoute>
              }/>

              {/* ─── Manager Routes ─── */}
              <Route path="/manager/dashboard" element={
                <ProtectedRoute role="Manager"><ManagerDashboard /></ProtectedRoute>
              }/>
              <Route path="/manager/blogs" element={
                <ProtectedRoute role="Manager"><AdminBlogs /></ProtectedRoute>
              }/>
              <Route path="/manager/diplomas" element={
                <ProtectedRoute role="Manager"><AdminDiplomas /></ProtectedRoute>
              }/>
              <Route path="/manager/programs" element={
                <ProtectedRoute role="Manager"><AddCoursePage /></ProtectedRoute>
              }/>

              {/* ─── Student Routes ─── */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute role="Student"><StudentDashboard /></ProtectedRoute>
              }/>
              <Route path="/student/courses" element={
                <ProtectedRoute role="Student"><StudentCoursesPage /></ProtectedRoute>
              }/>
              <Route path="/student/courses/:courseId" element={
                <ProtectedRoute role="Student"><StudentLecturesPage /></ProtectedRoute>
              }/>
              <Route path="/student/exams" element={
                <ProtectedRoute role="Student"><StudentExamsPage /></ProtectedRoute>
              }/>
              <Route path="/student/exams/:examId" element={
                <ProtectedRoute role="Student"><StudentExamAttemptPage /></ProtectedRoute>
              }/>
              <Route path="/student/messages" element={
                <ProtectedRoute role="Student"><StudentMessages /></ProtectedRoute>
              }/>

              {/* ─── Catch All ─── */}
              <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;