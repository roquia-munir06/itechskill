import React, { lazy, Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import WithNavbar from "./layouts/WithNavbar";
import { HelmetProvider } from 'react-helmet-async';
import SEO from "./components/SEO";
const YouTubeRecommendations  = lazy(() => import("./pages/YouTubeRecommendations"));
const Login                   = lazy(() => import("./pages/Login"));
const Register                = lazy(() => import("./pages/Register"));
const PricingPlan             = lazy(() => import("./pages/PricingPlan"));
const Courses_Screen          = lazy(() => import("./pages/Courses_Screen"));
const AboutUs                 = lazy(() => import("./pages/AboutUs"));
const Careers                 = lazy(() => import("./pages/Careers"));
const Contact                 = lazy(() => import("./pages/Contact"));
const Categories              = lazy(() => import("./pages/Categories"));
const All_Courses             = lazy(() => import("./pages/All_Courses"));
const Certification           = lazy(() => import("./pages/Certification"));
const AffiliateProgram        = lazy(() => import("./pages/AffiliateProgram"));
const Privacy                 = lazy(() => import("./pages/Privacy"));
const Terms                   = lazy(() => import("./pages/Terms"));
const HelpCenter              = lazy(() => import("./pages/HelpCenter"));
const Faq                     = lazy(() => import("./pages/Faq"));
const Blog                    = lazy(() => import("./pages/Blog"));
const BlogDetails             = lazy(() => import("./pages/BlogDetails"));
const CategoryPage            = lazy(() => import("./pages/CategoryPage"));
const OpenPositions           = lazy(() => import("./components/OpenPositions"));
const FeeStructure            = lazy(() => import("./pages/FeeStructure"));
const DiplomaScreen           = lazy(() => import("./pages/DiplomasScreen"));
const DiplomaDetail           = lazy(() => import("./pages/DiplomaDetail"));
const ProgramDetail = lazy(() => import("./pages/CourseDetail_Screen"));
const CartPage                = lazy(() => import("./pages/CartPage"));
const CheckoutPage            = lazy(() => import("./pages/CheckoutPage"));
const CourseDetail_Screen     = lazy(() => import("./pages/CourseDetail_Screen"));
const ManagerUsersPage = lazy(() => import("./pages/ManagerUsersPage"));
const SearchPage= lazy(() => import ("./pages/SearchPage"));
const CourseOutline       = lazy(() => import("./pages/Courseoutline"));
const CourseOutlineDetail = lazy(() => import("./pages/Courseoutlinedetail"));
// Admin Pages
const Dashboard               = lazy(() => import("./pages/Dashboard"));
const Users                   = lazy(() => import("./pages/Users"));
const Students                = lazy(() => import("./pages/Students"));
const AdminDiplomas           = lazy(() => import("./pages/AdminDiplomas"));
const AdminExamResults        = lazy(() => import("./pages/AdminExamResults"));
const AdminBlogs              = lazy(() => import("./pages/AdminBlogs"));
const AddCoursePage           = lazy(() => import("./pages/AddCoursePage"));
const AdminOrdersPage         = lazy(() => import("./pages/AdminOrdersPage"));
const AdminInquiriesPage      = lazy(() => import("./pages/AdminInquiriesPage"));
const AdminCertificationsPage = lazy(() => import("./pages/AdminCertificationsPage"));
const AdminJobsPage           = lazy(() => import("./pages/Adminjobspage"));
const AdminVendorCertificationsPage = lazy(() => import("./pages/AdminVendorCertifications"));
// const AdminMessages           = lazy(() => import("./pages/AdminMessages"));
const Courses                 = lazy(() => import("./pages/Courses"));
const Lectures                = lazy(() => import("./pages/Lectures"));
const MockExams               = lazy(() => import("./pages/MockExam"));
const ExamQuestionsPage       = lazy(() => import("./pages/ExamQuestionsPage"));
// Teacher & Manager Pages
const TeacherDashboard        = lazy(() => import("./pages/TeacherDashboard"));
const ManagerDashboard        = lazy(() => import("./pages/ManagerDashboard"));
// Student Pages
const StudentDashboard        = lazy(() => import("./pages/StudentDashboard"));
const StudentCoursesPage      = lazy(() => import("./pages/StudentCoursesPage"));
const StudentLecturesPage     = lazy(() => import("./pages/StudentLecturesPage"));
const StudentExamsPage        = lazy(() => import("./pages/StudentExamsPage"));
const StudentExamAttemptPage  = lazy(() => import("./pages/StudentExamAttemptPage"));
// const StudentMessages         = lazy(() => import("./pages/StudentMessages"));
const Messages = lazy(() => import("./pages/Messages"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
// ✅ Loading spinner shown while page loads
const PageLoader = () => (
  <div style={{
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '100vh',
    fontSize: '18px', color: '#555'
  }}>
    Loading...
  </div>
);

const GOOGLE_CLIENT_ID = "6986784869-oqb208j0kv2ur695evmnu33ovc4r9lcb.apps.googleusercontent.com";

function App() {
  return (
    <HelmetProvider>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <SEO />
            {/* ✅ Suspense wraps ALL routes */}
            <Suspense fallback={<PageLoader />}>
              <Routes> 
                {/* ─── Public Routes with Navbar ─── */}
                <Route element={<WithNavbar />}>
                  <Route path="/" element={<YouTubeRecommendations />} />
                  <Route path="/pricing" element={<PricingPlan />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/trainings" element={<Courses_Screen />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/AboutUs" element={<AboutUs />} />
                  <Route path="/Careers" element={<Careers />} />
                  <Route path="/Contact" element={<Contact />} />
                  <Route path="/Categories" element={<Categories />} />
                  <Route path="/course" element={<All_Courses />} /> 
                  <Route path="/course-outline" element={<CourseOutline />} />
<Route path="/course-outline/:type/:slug" element={<CourseOutlineDetail />} />
                  <Route path="/all-courses" element={<All_Courses />} />
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
                  <Route path="/diplomas" element={<DiplomaScreen />} />
                  <Route path="/diplomas/:slug" element={<DiplomaDetail />} />
                  <Route path="/programs/:slug" element={<ProgramDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/course/:slug" element={<CourseDetail_Screen />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                </Route>

                {/* ─── Admin Routes ─── */}
                <Route path="/admin/dashboard" element={<ProtectedRoute role="Admin"><Dashboard /></ProtectedRoute>}/>
                <Route path="/users" element={<ProtectedRoute role="Admin"><Users /></ProtectedRoute>}/>
                <Route path="/students" element={<ProtectedRoute role="Admin"><Students /></ProtectedRoute>}/>
                <Route path="/admin/diplomas" element={<ProtectedRoute role="Admin"><AdminDiplomas /></ProtectedRoute>}/>
                <Route path="/admin/exam-results" element={<ProtectedRoute role="Admin"><AdminExamResults /></ProtectedRoute>}/>
                <Route path="/admin/blogs" element={<ProtectedRoute role="Admin"><AdminBlogs /></ProtectedRoute>}/>
                <Route path="/admin/programs" element={<ProtectedRoute role="Admin"><AddCoursePage /></ProtectedRoute>}/>
                <Route path="/admin/orders" element={<ProtectedRoute role="Admin"><AdminOrdersPage /></ProtectedRoute>}/>
                <Route path="/admin/inquiries" element={<ProtectedRoute role="Admin"><AdminInquiriesPage /></ProtectedRoute>}/>
                <Route path="/admin/certifications" element={<ProtectedRoute role="Admin"><AdminCertificationsPage /></ProtectedRoute>}/>
                <Route path="/admin/vendor-certifications" element={<ProtectedRoute role="Admin"><AdminVendorCertificationsPage /></ProtectedRoute>}/>
                <Route path="/admin/jobs" element={<ProtectedRoute role="Admin"><AdminJobsPage /></ProtectedRoute>}/>

                {/* ─── Shared: Admin + Teacher ─── */}
                <Route path="/courses" element={<ProtectedRoute roles={["Admin", "Teacher"]}><Courses /></ProtectedRoute>}/>
                <Route path="/lectures/:courseId" element={<ProtectedRoute roles={["Admin", "Teacher"]}><Lectures /></ProtectedRoute>}/>
                <Route path="/mockexams" element={<ProtectedRoute roles={["Admin", "Teacher"]}><MockExams /></ProtectedRoute>}/>
                <Route path="/mock-exams/:examId/questions" element={<ProtectedRoute roles={["Admin", "Teacher"]}><ExamQuestionsPage /></ProtectedRoute>}/>

                {/* ─── Shared: Admin + Teacher + Manager ─── */}
                {/* <Route path="/admin/messages" element={<ProtectedRoute roles={["Admin", "Teacher", "Manager"]}><AdminMessages /></ProtectedRoute>}/> */}
<Route path="/admin/messages" element={<ProtectedRoute roles={["Admin","Teacher","Manager"]}><Messages /></ProtectedRoute>} />
<Route path="/student/messages" element={<ProtectedRoute role="Student"><Messages /></ProtectedRoute>} />
                {/* ─── Teacher Routes ─── */}
                <Route path="/teacher/dashboard" element={<ProtectedRoute role="Teacher"><TeacherDashboard /></ProtectedRoute>}/>
                <Route path="/teacher/mockexams" element={<ProtectedRoute role="Teacher"><MockExams /></ProtectedRoute>}/>

                {/* ─── Manager Routes ─── */}
                <Route path="/manager/dashboard" element={<ProtectedRoute role="Manager"><ManagerDashboard /></ProtectedRoute>}/>
                <Route path="/manager/blogs" element={<ProtectedRoute role="Manager"><AdminBlogs /></ProtectedRoute>}/>
                <Route path="/manager/diplomas" element={<ProtectedRoute role="Manager"><AdminDiplomas /></ProtectedRoute>}/>
                <Route path="/manager/programs" element={<ProtectedRoute role="Manager"><AddCoursePage /></ProtectedRoute>}/>
                <Route path="/manager/users" element={<ProtectedRoute role="Manager"><ManagerUsersPage /></ProtectedRoute>}/>
                <Route path="/student/dashboard" element={<ProtectedRoute role="Student"><StudentDashboard /></ProtectedRoute>}/>
                <Route path="/student/courses" element={<ProtectedRoute role="Student"><StudentCoursesPage /></ProtectedRoute>}/>
                <Route path="/student/courses/:courseId" element={<ProtectedRoute role="Student"><StudentLecturesPage /></ProtectedRoute>}/>
                <Route path="/student/exams" element={<ProtectedRoute role="Student"><StudentExamsPage /></ProtectedRoute>}/>
                <Route path="/student/exams/:examId" element={<ProtectedRoute role="Student"><StudentExamAttemptPage /></ProtectedRoute>}/>
                {/* <Route path="/student/messages" element={<ProtectedRoute role="Student"><StudentMessages /></ProtectedRoute>}/> */}

                {/* ─── Catch All ─── */}
                <Route path="*" element={<Navigate to="/login" replace />} />

              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
    </HelmetProvider>
  );
}

export default App;