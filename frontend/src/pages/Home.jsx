import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Apartments from "../components/Apartments";
import Environment from "../components/Environment";
import Experiences from "../components/Experiences";
import Testimonials from "../components/Testimonials";
import BookingForm from "../components/BookingForm";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Apartments />
      <Environment />
      <Experiences />
      <Testimonials />
      <BookingForm />
      <Contact />
      <Footer />
    </div>
  );
}
